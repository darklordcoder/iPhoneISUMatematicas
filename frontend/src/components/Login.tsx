import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
    navigate('/menu');
  };

  return (
    <motion.div 
      className="h-full bg-gradient-to-b from-[#b2d4f7] to-[#c9e0f8] px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo o título */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-[#2c4c7c]">
          Welcome Back
        </h1>
        <p className="text-[#5a7ba5] mt-2">
          Please sign in to continue
        </p>
      </motion.div>

      {/* Formulario */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full h-10 px-4 
                     bg-white bg-opacity-90 
                     border border-[#a5c4e5]
                     rounded-xl
                     text-[#2c4c7c]
                     placeholder-[#8fabc4]
                     shadow-inner
                     focus:outline-none focus:border-[#3478c9]"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-10 px-4 
                     bg-white bg-opacity-90
                     border border-[#a5c4e5]
                     rounded-xl
                     text-[#2c4c7c]
                     placeholder-[#8fabc4]
                     shadow-inner
                     focus:outline-none focus:border-[#3478c9]"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        {/* Botón de inicio de sesión */}
        <motion.button
          type="submit"
          className="w-full h-11 mt-6
                   bg-gradient-to-b from-[#4994e4] to-[#3478c9]
                   text-white font-semibold
                   rounded-xl
                   shadow-md
                   active:from-[#3478c9] active:to-[#2d6ab5]
                   transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign In
        </motion.button>

        {/* Enlaces adicionales */}
        <motion.div 
          className="mt-6 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            type="button"
            className="text-[#3478c9] text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Forgot Password?
          </motion.button>
          <div className="text-[#5a7ba5] text-sm">
            Don't have an account?{' '}
            <motion.button
              type="button"
              className="text-[#3478c9] font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}; 