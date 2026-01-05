import { Shield, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="header-gradient py-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="relative p-3 bg-primary/10 rounded-xl border border-primary/30">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wider text-glow-cyan">
              SMARTSENSE
            </h1>
            <p className="text-sm text-muted-foreground tracking-wide">
              Workplace Safety Monitor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 glass-panel">
            <Activity className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">LIVE</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-3 px-4 py-2 glass-panel text-sm">
              <span className="text-foreground">{user.name}</span>
              <span className="text-muted-foreground">({user.role})</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-primary"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
