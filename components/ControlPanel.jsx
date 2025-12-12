import { ChevronLeft, ChevronRight, RefreshCw, Download, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidHex } from '../lib/colorUtils';
import { useState, useRef, useEffect } from 'react';

// --- CONSTANTS ---
const BLINDNESS_MODES = [
  { id: 'none', label: 'Normal Vision' },
  { id: 'protanopia', label: 'Protanopia (Red Blind)' },
  { id: 'deuteranopia', label: 'Deuteranopia (Green Blind)' },
  { id: 'tritanopia', label: 'Tritanopia (Blue Blind)' },
  { id: 'achromatopsia', label: 'Achromatopsia (Mono)' },
];

// --- SUB-COMPONENTS ---

const Branding = () => (
  <div className="flex items-center justify-center lg:justify-start lg:border-r border-white/10 lg:pr-6 min-w-[100px] pt-1 lg:pt-0 pb-1 lg:pb-0">
    <img 
      src="/picsso-brand.svg" 
      alt="PiCSSo" 
      className="h-12 w-auto select-none drop-shadow-md" 
    />
  </div>
);

const ColorNavigator = ({ baseColor, inputValue, onHueChange, onInputChange, colorInputRef }) => {
  const isError = inputValue.length > 0 && !isValidHex(inputValue);

  return (
    <div className={`
      w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 
      bg-black/20 rounded-2xl p-1.5 border 
      lg:mx-auto flex-1 max-w-xl shadow-inner group-hover/nav:border-white/10 transition-all duration-300
      ${isError ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-white/5'}
    `}>
      <button onClick={() => onHueChange(-15)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 active:scale-95 transition-colors text-gray-500 hover:text-white">
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div 
        className="flex items-center gap-3 sm:gap-4 px-2 cursor-pointer group select-none flex-1 justify-center" 
        onClick={() => colorInputRef.current?.click()}
      >
        <div className="w-10 h-10 rounded-full border border-white/10 shadow-lg group-hover:scale-110 transition-transform flex-shrink-0" style={{ backgroundColor: isValidHex(inputValue) ? baseColor : '#000000' }} />
        
        <div className="flex flex-col items-start min-w-[6rem]">
          <span className={`text-[9px] font-bold uppercase leading-none mb-1 tracking-widest transition-colors ${isError ? 'text-red-400' : 'text-gray-500'}`}>
            {isError ? 'Invalid Hex' : 'Base Color'}
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className={`font-mono text-xl select-none transition-colors ${isError ? 'text-red-500/50' : 'text-white/20'}`}>#</span>
            <input 
              type="text" 
              value={inputValue.replace('#', '')} 
              onChange={(e) => { e.stopPropagation(); onInputChange('#' + e.target.value); }} 
              className={`
                w-24 bg-transparent border-none outline-none text-2xl font-bold font-mono uppercase p-0 m-0 leading-none tracking-wider opacity-90 group-hover:opacity-100 transition-all drop-shadow-sm
                ${isError ? 'text-red-500' : 'text-white'}
              `}
              onClick={(e) => e.stopPropagation()} 
              spellCheck="false"
            />
          </div>
        </div>
        
        <input ref={colorInputRef} type="color" value={isValidHex(inputValue) ? inputValue : '#000000'} onChange={(e) => onInputChange(e.target.value)} className="sr-only" />
      </div>

      <button onClick={() => onHueChange(15)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 active:scale-95 transition-colors text-gray-500 hover:text-white">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const ToolsCapsule = ({ onExport, isExporting, blindnessMode, onBlindnessModeChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex w-full sm:w-auto gap-2 justify-center bg-black/20 border border-white/5 p-1.5 rounded-2xl shadow-inner text-gray-400" ref={menuRef}>
       <button 
          onClick={onExport} 
          disabled={isExporting}
          className="flex-1 sm:flex-none w-full sm:w-12 h-12 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
          title="Export PNG"
       >
         {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
       </button>
       
       <div className="relative flex-1 sm:flex-none w-full sm:w-auto h-12">
          <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className={`w-full sm:w-12 h-full rounded-xl border flex items-center justify-center transition-all active:scale-95 ${blindnessMode !== 'none' || isMenuOpen ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'border-transparent hover:bg-white/5 hover:border-white/5'}`}
          >
          {blindnessMode !== 'none' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
           <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-64 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 ring-1 ring-white/5 origin-top-right"
              >
                 <div className="px-4 py-2 text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 opacity-70">Simulate Vision</div>
                 <div className="flex flex-col gap-1 px-2">
                   {BLINDNESS_MODES.map((mode) => (
                     <button
                       key={mode.id}
                       onClick={() => {
                         onBlindnessModeChange(mode.id);
                         setIsMenuOpen(false);
                       }}
                       className={`w-full flex items-center justify-between px-4 py-2.5 text-left rounded-xl transition-all text-sm font-medium ${blindnessMode === mode.id ? 'bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                     >
                       <span>{mode.label}</span>
                       {blindnessMode === mode.id && <Check className="w-4 h-4 text-white" />}
                     </button>
                   ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
       </div>
    </div>
  );
};

const TabNavigation = ({ tabs, activeTab, onTabChange, baseColor }) => (
  <div className="flex justify-center w-full z-10 -mt-2">
     <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap select-none
              ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
            `}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute inset-0 rounded-full border shadow-sm backdrop-blur-md" 
                style={{ 
                  backgroundColor: `${baseColor}20`, 
                  borderColor: `${baseColor}40`, 
                  boxShadow: `0 0 20px ${baseColor}15`
                }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} 
              />
            )}
            <span className="relative z-10 tracking-wide">{tab.label}</span>
          </button>
        ))}
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export default function ControlPanel({ 
  baseColor, 
  inputValue, 
  activeTab, 
  tabs,
  blindnessMode,
  colorInputRef,
  onRandomize, 
  onExport,
  isExporting, 
  onBlindnessModeChange,
  onHueChange,
  onInputChange,
  onTabChange 
}) {
  return (
    <div className="relative z-20 flex-none w-full flex flex-col items-center pt-6 pb-4 px-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* CONTROL CAPSULE */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 sm:px-5 sm:py-3 shadow-2xl flex flex-col lg:flex-row items-center gap-4 lg:gap-6 justify-between z-50 transition-all hover:border-white/20 hover:shadow-indigo-500/5">
          
          <Branding />

          {/* Mobile Spacer */}
          <div className="w-full lg:hidden -mt-2" />

          {/* Controls Cluster */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1 justify-center lg:justify-between">
            
            <div className="w-full sm:w-auto flex justify-center">
               <button 
                onClick={onRandomize} 
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold group whitespace-nowrap min-w-[130px]"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Random</span>
              </button>
            </div>

            <ColorNavigator 
              baseColor={baseColor} 
              inputValue={inputValue} 
              onHueChange={onHueChange} 
              onInputChange={onInputChange} 
              colorInputRef={colorInputRef} 
            />

            <ToolsCapsule 
              onExport={onExport} 
              isExporting={isExporting} 
              blindnessMode={blindnessMode} 
              onBlindnessModeChange={onBlindnessModeChange} 
            />

          </div>
        </div>
        
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          baseColor={baseColor} 
        />

      </div>
    </div>
  );
}
