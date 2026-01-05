import { useState, useEffect, useCallback, useRef } from 'react';
import { SensorData, SensorReading } from '@/types/sensor';

interface UseWebSocketOptions {
  url: string;
  simulateData?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket({ url, simulateData = true, reconnectInterval = 3000 }: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentData, setCurrentData] = useState<SensorReading | null>(null);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const simulateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const determineStatus = useCallback((temp: number, gas: number): SensorData['status'] => {
    if (temp > 45 || gas > 500) return 'DANGER';
    if (temp > 35 || gas > 300) return 'WARNING';
    return 'SAFE';
  }, []);

  const generateSimulatedData = useCallback((): SensorReading => {
    // Generate realistic sensor data with occasional spikes
    const baseTemp = 28 + Math.random() * 10;
    const baseGas = 150 + Math.random() * 100;
    const baseHumidity = 40 + Math.random() * 30;
    
    // 10% chance of warning levels, 5% chance of danger levels
    const spike = Math.random();
    let temperature = baseTemp;
    let gas_level = baseGas;
    
    if (spike > 0.95) {
      temperature = 46 + Math.random() * 10;
      gas_level = 510 + Math.random() * 100;
    } else if (spike > 0.85) {
      temperature = 36 + Math.random() * 8;
      gas_level = 310 + Math.random() * 150;
    }

    const status = determineStatus(temperature, gas_level);

    return {
      temperature: Math.round(temperature * 10) / 10,
      gas_level: Math.round(gas_level),
      humidity: Math.round(baseHumidity * 10) / 10,
      status,
      timestamp: new Date(),
    };
  }, [determineStatus]);

  const addReading = useCallback((reading: SensorReading) => {
    setCurrentData(reading);
    setHistory(prev => {
      const newHistory = [...prev, reading];
      // Keep only last 20 readings
      return newHistory.slice(-20);
    });
  }, []);

  const startSimulation = useCallback(() => {
    if (simulateIntervalRef.current) return;
    
    setIsConnected(true);
    // Initial data
    addReading(generateSimulatedData());
    
    simulateIntervalRef.current = setInterval(() => {
      addReading(generateSimulatedData());
    }, 2000);
  }, [addReading, generateSimulatedData]);

  const stopSimulation = useCallback(() => {
    if (simulateIntervalRef.current) {
      clearInterval(simulateIntervalRef.current);
      simulateIntervalRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (simulateData) {
      startSimulation();
      return;
    }

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data: SensorData = JSON.parse(event.data);
          addReading({
            ...data,
            timestamp: new Date(),
          });
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        // Attempt to reconnect
        setTimeout(connect, reconnectInterval);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        wsRef.current?.close();
      };
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
      // Fall back to simulation
      startSimulation();
    }
  }, [url, simulateData, reconnectInterval, addReading, startSimulation]);

  const disconnect = useCallback(() => {
    if (simulateData) {
      stopSimulation();
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, [simulateData, stopSimulation]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    currentData,
    history,
    connect,
    disconnect,
  };
}
