import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';

extend([a11yPlugin]);

const getContrastColor = (hex) => {
  return colord(hex).isDark() ? '#ffffff' : '#000000';
};

export default function PaletteDisplay({ colors, copiedColor, onCopy }) {
  return (
    <div className="relative z-10 flex-grow min-h-0 w-full overflow-hidden">
        {/* Adaptive Layout Container */}
       <div className="
          flex flex-col landscape:flex-row 
          w-full h-full p-4 gap-4 /* Added gap-4 for uniform spacing */
          md:max-w-[95%] md:mx-auto 
          overflow-y-auto landscape:overflow-hidden
          landscape:pb-20
       ">
          {/* Main Palette Strip */}
          <div className="
             w-full flex-shrink-0 grid grid-cols-1 gap-4 pb-24
             landscape:flex landscape:w-full landscape:h-full landscape:pb-0 landscape:gap-3 /* GAP-3: The sweet spot (dempet tapi tidak nempel) */
             items-stretch
          ">
            {colors.map((color, index) => {
              const textColor = getContrastColor(color);
              return (
                <div
                  key={`${color}-${index}`}
                  onClick={() => onCopy(color)}
                  className="
                     relative group cursor-pointer 
                     h-20 landscape:h-auto 
                     flex items-center justify-between landscape:items-end landscape:justify-center 
                     landscape:flex-1 landscape:min-w-0
                     
                     /* REVERTED TO INDIVIDUAL ROUNDED CARDS */
                     rounded-2xl landscape:rounded-[1.5rem] 
                     border border-white/5 
                     shadow-lg 
                     overflow-hidden

                     /* SMOOTH HOVER PHYSICS */
                     transition-[flex-grow,transform,box-shadow,filter] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                     
                     landscape:hover:flex-[4] 
                     landscape:hover:z-10
                     landscape:hover:scale-[1.02]
                     landscape:hover:shadow-2xl hover:border-white/20
                  "
                  style={{ backgroundColor: color }}
                >
                  {/* Gloss Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 landscape:opacity-100 pointer-events-none mix-blend-overlay" />

                  {/* PORTRAIT LABEL */}
                  <div className="flex landscape:hidden items-center gap-3 px-5 w-full justify-between">
                     <span className="font-mono font-bold text-lg tracking-wider" style={{ color: textColor }}>{color}</span>
                     <Copy className="w-4 h-4 opacity-50" style={{ color: textColor }} />
                  </div>

                  {/* LANDSCAPE LABEL */}
                  <div className="hidden landscape:flex flex-col items-center mb-12 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 transform translate-y-6 group-hover:translate-y-0">
                    <span className="font-mono font-black text-4xl tracking-tight drop-shadow-sm" style={{ color: textColor }}>
                      {color}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] mt-2 opacity-60 font-bold" style={{ color: textColor }}>
                      Click to Copy
                    </span>
                  </div>

                  {/* Check Icon Overlay */}
                  <AnimatePresence>
                    {copiedColor === color && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
                        <Check className="w-12 h-12 text-white drop-shadow-2xl" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}
