import { ReactNode } from 'react';
import { SensorStatus } from '@/types/sensor';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: ReactNode;
  status: SensorStatus;
  thresholds?: {
    warning: number;
    danger: number;
  };
}

export function SensorCard({ title, value, unit, icon, status, thresholds }: SensorCardProps) {
  const getCardClass = () => {
    switch (status) {
      case 'DANGER':
        return 'sensor-card-danger';
      case 'WARNING':
        return 'sensor-card-warning';
      default:
        return 'sensor-card-safe';
    }
  };

  const getValueClass = () => {
    switch (status) {
      case 'DANGER':
        return 'text-status-danger text-glow-danger';
      case 'WARNING':
        return 'text-status-warning text-glow-warning';
      default:
        return 'text-status-safe text-glow-safe';
    }
  };

  const getIconClass = () => {
    switch (status) {
      case 'DANGER':
        return 'text-status-danger';
      case 'WARNING':
        return 'text-status-warning';
      default:
        return 'text-status-safe';
    }
  };

  const getIndicatorClass = () => {
    switch (status) {
      case 'DANGER':
        return 'status-indicator-danger';
      case 'WARNING':
        return 'status-indicator-warning';
      default:
        return 'status-indicator-safe';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('sensor-card p-6 min-h-[200px]', getCardClass())}
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current opacity-30" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current opacity-30" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current opacity-30" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current opacity-30" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-3 rounded-lg bg-background/50', getIconClass())}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn('status-indicator', getIndicatorClass())} />
              <span className="text-xs text-muted-foreground font-medium">
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mt-6">
        <motion.span
          key={value}
          initial={{ opacity: 0.5, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn('text-5xl font-display font-bold tracking-tight', getValueClass())}
        >
          {value}
        </motion.span>
        <span className="text-xl text-muted-foreground font-medium">{unit}</span>
      </div>

      {thresholds && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Warning: &gt;{thresholds.warning}</span>
            <span>Danger: &gt;{thresholds.danger}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
