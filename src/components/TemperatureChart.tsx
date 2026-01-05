import { SensorReading } from '@/types/sensor';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface TemperatureChartProps {
  data: SensorReading[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  const chartData = data.map((reading, index) => ({
    time: format(reading.timestamp, 'HH:mm:ss'),
    temperature: reading.temperature,
    index,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 border border-primary/30">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-display font-bold text-primary">
            {payload[0].value}°C
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground tracking-wider">
            TEMPERATURE TREND
          </h3>
          <p className="text-sm text-muted-foreground">Last 20 readings</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-status-warning" />
            <span className="text-muted-foreground">Warning (35°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-status-danger" />
            <span className="text-muted-foreground">Danger (45°C)</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(187 94% 43%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(187 94% 43%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(215 28% 15%)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="hsl(215 20% 45%)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 60]}
              stroke="hsl(215 20% 45%)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={35}
              stroke="hsl(38 92% 50%)"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            <ReferenceLine
              y={45}
              stroke="hsl(0 84% 60%)"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="none"
              fill="url(#temperatureGradient)"
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="hsl(187 94% 43%)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: 'hsl(187 94% 43%)',
                stroke: 'hsl(222 47% 6%)',
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
