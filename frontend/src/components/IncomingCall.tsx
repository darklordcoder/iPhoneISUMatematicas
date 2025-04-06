import { motion, AnimatePresence } from 'framer-motion';

interface IncomingCallProps {
  onClose: () => void;
}

const IncomingCall = ({ onClose }: IncomingCallProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-lg flex flex-col items-center pt-12 z-50"
      >
        {/* Caller Info */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-600 rounded-full mb-4 mx-auto flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-medium mb-2">John Doe</h2>
          <p className="text-gray-400 text-lg">llamada móvil</p>
        </motion.div>

        {/* Llamada entrante animada */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-white text-xl font-light"
        >
          llamada entrante...
        </motion.div>

        {/* Botones de acción */}
        <div className="mt-auto mb-12 w-full px-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Rechazar llamada */}
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-white">Rechazar</span>
            </motion.button>

            {/* Aceptar llamada */}
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={onClose}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-white">Aceptar</span>
            </motion.button>
          </div>
        </div>

        {/* Efecto de vibración */}
        <motion.div
          animate={{
            x: [-1, 1, -1, 1, -1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="absolute inset-0 pointer-events-none"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default IncomingCall; 