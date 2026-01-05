import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertBannerProps {
  show: boolean;
}

export function AlertBanner({ show }: AlertBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="alert-banner flex items-center justify-center gap-3"
        >
          <AlertTriangle className="w-6 h-6 animate-pulse" />
          <span className="tracking-wider">⚠️ CRITICAL ALERT: DANGER LEVEL DETECTED ⚠️</span>
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
