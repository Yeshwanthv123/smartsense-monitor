import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  isConnected: boolean;
}

export function Footer({ isConnected }: FooterProps) {
  return (
    <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © 2024 SmartSense Industrial Safety Systems
        </p>
        
        <div className="flex items-center gap-3">
          <div className={cn(
            'connection-dot',
            isConnected ? 'connection-dot-connected' : 'connection-dot-disconnected'
          )} />
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-status-safe" />
                <span className="text-status-safe font-medium">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Disconnected</span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
