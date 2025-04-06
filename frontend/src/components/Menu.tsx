import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import IncomingCall from './IncomingCall';

export const Menu = () => {
  const navigate = useNavigate();
  const [showCall, setShowCall] = useState(false);

  const menuItems = [
   
    {
      id: 2,
      title: "Ciudades del Mundo",
      description: "Explora ciudades de diferentes países",
      icon: "🌎",
      path: "/cities",
      color: "bg-blue-100",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500"
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
        <motion.div
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
        </motion.div>

        {/* Menú de opciones */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.path || item.id}
              onClick={() => item.action ? item.action() : navigate(item.path!)}
              className="flex items-center w-full p-3 space-x-3 transition-colors bg-white shadow-sm rounded-xl active:bg-gray-50"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`flex-shrink-0 w-10 h-10 ${item.color} ${item.borderColor} rounded-lg flex items-center justify-center ${item.iconColor}`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </motion.button>
          ))}
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