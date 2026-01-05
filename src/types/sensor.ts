export type SensorStatus = 'SAFE' | 'WARNING' | 'DANGER';

export interface SensorData {
  temperature: number;
  gas_level: number;
  humidity: number;
  status: SensorStatus;
  timestamp?: string;
}

export interface SensorReading {
  temperature: number;
  gas_level: number;
  humidity: number;
  status: SensorStatus;
  timestamp: Date;
}
