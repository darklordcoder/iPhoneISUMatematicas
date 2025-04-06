import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import IncomingCall from './IncomingCall';

export const Menu = () => {
  const navigate = useNavigate();
  const [showCall, setShowCall] = useState(false);

  const menuItems = [
    {
      id: 7,
      title: "Implementacion Código C#",
      description: "Ver el repositorio en GitHub",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>,
      action: () => window.open('https://github.com/darklordcoder/iPhoneISUMatematicas/blob/main/build.bat', '_blank'),
      color: "bg-gray-100",
      borderColor: "border-gray-200",
      iconColor: "text-gray-700",
      highlighted: true,
      highlightColor: "bg-orange-200"
    },
    {
      id: 2,
      title: "Ciudades del Mundo",
      description: "Explora ciudades de diferentes países",
      icon: "🌎",
      path: "/cities",
      color: "bg-blue-100",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
      highlighted: false,
      highlightColor: "bg-blue-100"
    },
    
    {
      id: 3,
      title: "Lenguajes de Programación",
      description: "Descubre diferentes lenguajes",
      icon: "💻",
      path: "/programming",
      color: "bg-green-100",
      borderColor: "border-green-200",
      iconColor: "text-green-500"
    },
    {
      id: 4,
      title: "Calculadora",
      description: "Realiza operaciones matemáticas",
      icon: "🧮",
      path: "/calculator",
      color: "bg-orange-100",
      borderColor: "border-orange-200",
      iconColor: "text-orange-500"
    },
    {
      id: 5,
      title: "El Clima",
      description: "Consulta el pronóstico del tiempo",
      icon: "🌤️",
      path: "/weather",
      color: "bg-cyan-100",
      borderColor: "border-cyan-200",
      iconColor: "text-cyan-500"
    },
    {
      id: 6,
      title: "Simular Llamada",
      description: "Recibe una llamada entrante",
      icon: "📞",
      action: () => setShowCall(true),
      color: "bg-indigo-100",
      borderColor: "border-indigo-200",
      iconColor: "text-indigo-500"
    },
   
    {
      id: 1,
      title: "Pantalla de Inicio",
      description: "Ver la pantalla principal del teléfono",
      icon: "🏠",
      path: "/home",
      color: "bg-purple-100",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative flex flex-col h-full bg-gray-50"
    >
      {/* Área scrollable */}
      <div className="flex-1 p-2 overflow-y-auto">
        {/* Perfil */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 mb-6 bg-white shadow-sm rounded-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-blue-500 rounded-full">
              JD
            </div>
            <div>
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-gray-500">Usuario Premium</p>
            </div>
          </div>
        </motion.div>

        {/* Notificaciones */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 mb-6 bg-white shadow-sm rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notificaciones</h3>
            <span className="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">2</span>
          </div>
          <div className="mt-2">
            <div className="flex items-center p-2 space-x-3 rounded-lg bg-blue-50">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-200 rounded-full">
                <span className="text-blue-600">📢</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nueva actualización disponible</p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </div>
          </div>
        </motion.div> */}

        {/* Menú de opciones */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            return (
              <motion.button
                key={item.path || item.id}
                onClick={() => item.action ? item.action() : navigate(item.path!)}
                className={`
                flex items-center w-full p-3 space-x-3 transition-all duration-300 shadow-sm rounded-xl
                ${item.highlighted ? item.highlightColor : 'bg-white'}
                ${item.highlighted ? `hover:${item.highlightColor}` : 'hover:bg-gray-50'}
              `}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`flex-shrink-0 w-10 h-10 ${item.color} ${item.borderColor} rounded-lg flex items-center justify-center ${item.iconColor} ${item.highlighted ? 'ring-2 ring-offset-2 ring-opacity-50 ring-' + item.iconColor.replace('text-', '') : ''}`}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium ${item.highlighted ? 'text-gray-900' : ''}`}>{item.title}</h3>
                  <p className={`text-sm ${item.highlighted ? 'text-gray-700' : 'text-gray-500'}`}>{item.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Botón de cerrar sesión - Parte inferior fija dentro del marco */}
      <div className="p-6 bg-gray-50">
        <motion.button
          onClick={() => navigate('/login')}
          className="flex items-center w-full p-3 space-x-3 transition-colors bg-white border border-red-100 shadow-sm rounded-xl active:bg-gray-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-red-500 bg-red-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-red-500">Cerrar Sesión</h3>
            <p className="text-sm text-gray-500">Salir de la aplicación</p>
          </div>
        </motion.button>
      </div>

      {/* Componente de llamada entrante */}
      {showCall && <IncomingCall onClose={() => setShowCall(false)} />}
    </motion.div>
  );
}; 