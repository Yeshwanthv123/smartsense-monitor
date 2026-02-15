import { Thermometer, Wind, Droplets } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { AlertBanner } from './AlertBanner';
import { SensorCard } from './SensorCard';
import { TemperatureChart } from './TemperatureChart';
import { Header } from './Header';
import { Footer } from './Footer';

export function Dashboard() {
  const { isConnected, currentData, history } = useWebSocket({
    url: 'ws://localhost:8000/ws',
    simulateData: false, // Connected to real backend
  });

  const isDanger = currentData?.status === 'DANGER';

  return (
    <div className="min-h-screen flex flex-col bg-background tech-grid scan-effect relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <AlertBanner show={isDanger} />
      
      <Header />

      <main className={`flex-1 px-4 sm:px-6 lg:px-8 py-8 ${isDanger ? 'pt-20' : ''}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Sensor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SensorCard
              title="Temperature"
              value={currentData?.temperature ?? 0}
              unit="°C"
              icon={<Thermometer className="w-6 h-6" />}
              status={currentData?.status ?? 'SAFE'}
              thresholds={{ warning: 35, danger: 45 }}
            />
            <SensorCard
              title="Gas Level"
              value={currentData?.gas_level ?? 0}
              unit="PPM"
              icon={<Wind className="w-6 h-6" />}
              status={currentData?.status ?? 'SAFE'}
              thresholds={{ warning: 300, danger: 1000 }}
            />
            <SensorCard
              title="Humidity"
              value={currentData?.humidity ?? 0}
              unit="%"
              icon={<Droplets className="w-6 h-6" />}
              status={currentData?.status ?? 'SAFE'}
            />
          </div>

          {/* Temperature Chart */}
          <TemperatureChart data={history} />

          {/* Status Summary */}
          <div className="glass-panel p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  System Status
                </h3>
                <p className="text-lg font-display">
                  {currentData?.status === 'DANGER' && (
                    <span className="text-status-danger text-glow-danger">
                      ⚠️ IMMEDIATE ACTION REQUIRED
                    </span>
                  )}
                  {currentData?.status === 'WARNING' && (
                    <span className="text-status-warning text-glow-warning">
                      ⚡ ELEVATED LEVELS DETECTED
                    </span>
                  )}
                  {currentData?.status === 'SAFE' && (
                    <span className="text-status-safe text-glow-safe">
                      ✓ ALL SYSTEMS NORMAL
                    </span>
                  )}
                  {!currentData && (
                    <span className="text-muted-foreground">
                      Awaiting sensor data...
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Readings collected</p>
                <p className="text-2xl font-display font-bold text-primary">
                  {history.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isConnected={isConnected} />
    </div>
  );
}
