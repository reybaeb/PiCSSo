import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// Lazy load html-to-image inside handleExport to reduce bundle size
import { getColors, isValidHex, adjustHue, getRandomColor, simulateColorBlindness } from '../lib/colorUtils';
import { usePopSound } from '../hooks/usePopSound';

// Components
import Toast from './Toast';
import ControlPanel from './ControlPanel';
import PaletteDisplay from './PaletteDisplay';

export default function FluidColorGenerator() {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [inputValue, setInputValue] = useState('#6366f1');
  const [activeTab, setActiveTab] = useState('alternatives');
  const [copiedColor, setCopiedColor] = useState(null);
  const [blindnessMode, setBlindnessMode] = useState('none');
  const [toastMessage, setToastMessage] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const colorInputRef = useRef(null);
  const playPop = usePopSound();

  const colors = useMemo(() => {
    const raw = getColors(baseColor, activeTab);
    return raw.map(c => simulateColorBlindness(c, blindnessMode));
  }, [baseColor, activeTab, blindnessMode]);

  const tabs = useMemo(() => [
    { id: 'alternatives', label: 'Alternatives' },
    { id: 'shades', label: 'Shades' },
    { id: 'tints', label: 'Tints' },
    { id: 'tones', label: 'Tones' },
    { id: 'hues', label: 'Hues' },
  ], []);

  const handleInputChange = useCallback((value) => {
    setInputValue(value);
    if (isValidHex(value)) setBaseColor(value);
  }, []);

  const handleHueChange = useCallback((amount) => {
    setBaseColor(prev => {
      const newColor = adjustHue(prev, amount);
      setInputValue(newColor);
      return newColor;
    });
  }, []);

  const handleRandomize = useCallback(() => {
    const random = getRandomColor();
    setBaseColor(random);
    setInputValue(random);
    playPop();
  }, [playPop]);

  const handleCopy = useCallback((color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setToastMessage(`Copied ${color}`);
    playPop();
    setTimeout(() => {
      setCopiedColor(null);
      setToastMessage(null);
    }, 2000);
  }, [playPop]);

  const handleExport = useCallback(async () => {
    const el = document.querySelector('.landscape\\:flex-row'); 
    if (!el) return;

    try {
      setIsExporting(true);
      setToastMessage("Preparing PiCSSo export...");
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(el, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `PiCSSo-${baseColor.replace('#', '')}-${blindnessMode}.png`;
      link.href = dataUrl;
      link.click();
      setToastMessage("Export downloaded!");
      setTimeout(() => setToastMessage(null), 2000);
    } catch (err) {
      console.error("Export failed:", err);
      setToastMessage("Export failed. Try again.");
    } finally {
      setIsExporting(false);
    }
  }, [baseColor, blindnessMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        handleRandomize();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRandomize]);

  return (
    <div className="fixed inset-0 bg-[#0F172A] text-white font-sans flex flex-col overflow-hidden selection:bg-indigo-500/30">
      <Toast message={toastMessage} visible={!!toastMessage} />
      
      <div className="absolute inset-0 z-0 bg-noise pointer-events-none opacity-30 mix-blend-overlay" />
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-1000 z-0 ease-in-out" 
        style={{ background: `radial-gradient(circle at 50% -20%, ${baseColor} 0%, transparent 80%)` }} 
      />

      <ControlPanel 
        baseColor={baseColor}
        inputValue={inputValue}
        activeTab={activeTab}
        tabs={tabs}
        blindnessMode={blindnessMode}
        colorInputRef={colorInputRef}
        onRandomize={handleRandomize}
        onExport={handleExport}
        isExporting={isExporting}
        onBlindnessModeChange={setBlindnessMode}
        onHueChange={handleHueChange}
        onInputChange={handleInputChange}
        onTabChange={setActiveTab}
      />

      <PaletteDisplay 
        colors={colors}
        copiedColor={copiedColor}
        onCopy={handleCopy}
      />

      {/* Desktop Hint */}
      <div className="hidden sm:flex fixed bottom-6 left-0 right-0 justify-center pointer-events-none z-10 opacity-70">
        <div className="bg-black/30 backdrop-blur-md border border-white/5 px-5 py-2 rounded-full text-xs text-white/50 font-mono tracking-wide flex items-center gap-2.5 shadow-xl transition-opacity hover:opacity-100">
          <span>Press</span>
          <kbd className="bg-white/10 px-2 py-0.5 rounded-md text-white/90 font-sans font-bold border border-white/10 shadow-inner">Space</kbd>
          <span>to paint</span>
        </div>
      </div>

      {/* EXPORT OVERLAY */}
      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">PNG</span>
            </div>
          </div>
          <p className="mt-4 text-white/80 font-medium tracking-wide animate-pulse">Generating Masterpiece...</p>
        </div>
      )}
    </div>
  );
}
