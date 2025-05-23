import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface WeatherData {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

const Weather = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('/api/weatherforecast');
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const getWeatherIcon = (summary: string) => {
    const icons: { [key: string]: { icon: string; color: string } } = {
      'Freezing': { 
        icon: '❄️', 
        color: 'from-blue-400 to-blue-600' 
      },
      'Bracing': { 
        icon: '🌬️', 
        color: 'from-cyan-400 to-cyan-600' 
      },
      'Chilly': { 
        icon: '🥶', 
        color: 'from-indigo-400 to-indigo-600' 
      },
      'Cool': { 
        icon: '😎', 
        color: 'from-teal-400 to-teal-600' 
      },
      'Mild': { 
        icon: '🌤️', 
        color: 'from-green-400 to-green-600' 
      },
      'Warm': { 
        icon: '☀️', 
        color: 'from-yellow-400 to-yellow-600' 
      },
      'Balmy': { 
        icon: '🌡️', 
        color: 'from-orange-400 to-orange-600' 
      },
      'Hot': { 
        icon: '🔥', 
        color: 'from-red-400 to-red-600' 
      },
      'Sweltering': { 
        icon: '🥵', 
        color: 'from-rose-400 to-rose-600' 
      },
      'Scorching': { 
        icon: '🌋', 
        color: 'from-purple-400 to-purple-600' 
      }
    };
    return icons[summary] || { icon: '🌡️', color: 'from-gray-400 to-gray-600' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 bg-gradient-to-b from-blue-400 to-blue-600"
    >
      {/* Botón de regresar */}
      <motion.button
        onClick={() => navigate('/menu')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute flex items-center justify-center w-10 h-10 text-white rounded-full top-16 left-4 bg-white/20 backdrop-blur-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <div className="mt-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-2xl font-semibold text-center text-white"
        >
          Pronóstico del Tiempo
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {weatherData.map((weather, index) => {
              const { icon, color } = getWeatherIcon(weather.summary);
              return (
                <motion.div
                  key={weather.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${color} rounded-3xl p-6 text-white shadow-lg backdrop-blur-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="mb-1 text-xl font-semibold capitalize">
                        {formatDate(weather.date)}
                      </h2>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-light">{weather.temperatureC}°C</p>
                        <p className="text-lg opacity-75">/ {weather.temperatureF}°F</p>
                      </div>
                      <p className="mt-1 text-sm capitalize opacity-90">{weather.summary}</p>
                    </div>
                    <div className="ml-4 text-6xl">
                      {icon}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Weather; 