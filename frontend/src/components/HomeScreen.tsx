import { motion } from 'framer-motion';

interface AppIcon {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const apps: AppIcon[] = [
  { id: '1', name: 'Mensajes', icon: '💬', color: 'bg-green-500' },
  { id: '2', name: 'Teléfono', icon: '📞', color: 'bg-blue-500' },
  { id: '3', name: 'Cámara', icon: '📸', color: 'bg-purple-500' },
  { id: '4', name: 'Fotos', icon: '🖼️', color: 'bg-pink-500' },
  { id: '5', name: 'Música', icon: '🎵', color: 'bg-red-500' },
  { id: '6', name: 'Clima', icon: '🌤️', color: 'bg-cyan-500' },
  { id: '7', name: 'Notas', icon: '📝', color: 'bg-yellow-500' },
  { id: '8', name: 'Mapas', icon: '🗺️', color: 'bg-indigo-500' },
  { id: '9', name: 'Ajustes', icon: '⚙️', color: 'bg-gray-500' },
  { id: '10', name: 'Reloj', icon: '⏰', color: 'bg-orange-500' },
  { id: '11', name: 'Calendario', icon: '📅', color: 'bg-teal-500' },
  { id: '12', name: 'Calculadora', icon: '🧮', color: 'bg-violet-500' }
];

const HomeScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-gradient-to-b from-blue-400 to-blue-600 p-4 flex flex-col"
    >
      <div className="flex-1 grid grid-cols-4 gap-4">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center text-2xl shadow-lg`}>
              {app.icon}
            </div>
            <span className="mt-1 text-xs text-white font-medium">{app.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Dock en la parte inferior */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-auto mb-2 flex justify-center"
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-2 flex gap-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-xl cursor-pointer">📱</motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-xl cursor-pointer">🌐</motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-xl cursor-pointer">📧</motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-xl cursor-pointer">🎮</motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen; 