import { useState, useEffect, ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

declare global {
  interface Navigator {
    getBattery(): Promise<BatteryManager>;
  }
}

export const PhoneFrame = ({ children }: PhoneFrameProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Obtener información de la batería
    const getBatteryInfo = async () => {
      try {
        const battery: any = await navigator.getBattery();
        
        // Actualizar estado inicial
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        // Escuchar cambios en el nivel de batería
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });

        // Escuchar cambios en el estado de carga
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      } catch (error) {
        console.error('Error al obtener información de la batería:', error);
      }
    };

    getBatteryInfo();

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="flex items-center justify-center min-h-screen sm:p-1 bg-gray-600">
      {/* Marco del iPhone */}
      <div className="w-full h-screen sm:w-[395px] sm:h-[800px] bg-black rounded-[20px] sm:rounded-[55px] relative sm:p-3 shadow-2xl">
        {/* Notch - visible solo en sm y mayor */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 h-8 w-[180px] bg-black rounded-b-[2rem] z-20">
          <div className="w-24 h-5 bg-black absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
            {/* Cámara y sensores */}
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800 absolute left-6"></div>
            <div className="absolute w-4 h-4 bg-gray-800 rounded-full right-6"></div>
          </div>
        </div>

        {/* Pantalla */}
        <div className="w-full h-full bg-white rounded-[15px] sm:rounded-[50px] overflow-hidden relative">
          {/* Barra de estado - visible solo en sm y mayor */}
          <div className="hidden sm:flex items-center justify-between w-full h-12 px-6 pt-2 bg-white">
            {/* Hora */}
            <div className="text-sm font-semibold">{formattedTime}</div>
            
            {/* Indicadores */}
            <div className="flex items-center gap-1.5">
              {/* Señal móvil */}
              <div className="flex gap-0.5 items-end h-3">
                <div className="w-0.5 h-1.5 bg-black rounded-sm"></div>
                <div className="w-0.5 h-2 bg-black rounded-sm"></div>
                <div className="w-0.5 h-2.5 bg-black rounded-sm"></div>
                <div className="w-0.5 h-3 bg-black rounded-sm"></div>
              </div>
              
              {/* WiFi */}
              <div className="flex items-center">
                <svg className="w-4 h-3" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C7.03 3 2.45 4.81 0 8.5c2.45 3.69 7.03 5.5 12 5.5s9.55-1.81 12-5.5C21.55 4.81 16.97 3 12 3z" 
                        fill="currentColor" fillOpacity="0.3"/>
                  <path d="M12 8C9.79 8 8 9.79 8 12s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" 
                        fill="currentColor"/>
                </svg>
              </div>
              
              {/* Batería */}
              <div className="flex items-center">
                <div className="relative">
                  <div className="relative w-6 h-3 overflow-hidden border border-black rounded-sm">
                    <div 
                      className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${isCharging ? 'bg-green-500' : 'bg-black'}`}
                      style={{ width: `${batteryLevel}%` }}
                    ></div>
                  </div>
                  <div className="h-2 w-[2px] bg-black absolute -right-[2px] top-1/2 -translate-y-1/2"></div>
                  {isCharging && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <span className="ml-1 text-xs font-medium">{batteryLevel}%</span>
              </div>
            </div>
          </div>

          {/* Contenido de la aplicación */}
          <div className="w-full h-full sm:h-[calc(100%-3rem)] bg-gray-50">
            {children}
          </div>
        </div>

        {/* Botones laterales - visibles solo en sm y mayor */}
        <div className="hidden sm:block absolute right-0 w-1 h-12 bg-gray-700 rounded-l top-24"></div>
        <div className="hidden sm:block absolute left-0 w-1 h-8 bg-gray-700 rounded-r top-24"></div>
        <div className="hidden sm:block absolute left-0 w-1 h-8 bg-gray-700 rounded-r top-36"></div>
        <div className="hidden sm:block absolute left-0 w-1 h-12 bg-gray-700 rounded-r top-48"></div>
      </div>
    </div>
  );
}; 