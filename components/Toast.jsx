import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 32, x: '-50%' }}
          exit={{ opacity: 0, y: -10, x: '-50%' }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="
            fixed top-0 left-1/2 z-[100] 
            px-6 py-2.5 
            bg-white/10 backdrop-blur-xl 
            border border-white/10 
            text-white shadow-2xl 
            rounded-full 
            flex items-center gap-3 
            pointer-events-none
          "
        >
          {/* Glassy Check Circle */}
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
          </div>
          
          <span className="font-sans font-medium text-sm tracking-wide text-white/90">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
