import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/images/7cdb546f-b9fc-4415-89c4-dd673f15cfe7.png';

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
      className="h-full bg-gradient-to-b from-[#ffffff] to-[#C64747] px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo o título */}
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <img src={logo} alt="Logo" className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#2c4c7c]">
          Métodos matemáticos en las ciencias computacionales
        </h1>
        <p className="text-[#ccccc] mt-2 mb-8">
        Actividad de Aprendizaje 1<br/>Diseño y verificación de algoritmos de seguridad
        </p>

        <p className="text-[#000] font-bold mt-2">
          Ingrese su usuario y password
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
                  bg-red-900
                   text-white font-semibold
                   rounded-xl
                   shadow-md
                   active:from-[#3478c9] active:to-[#2d6ab5]
                   transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          LOGIN
        </motion.button>

        {/* Enlaces adicionales */}
        <motion.div 
          className="flex flex-col items-center gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Botón de GitHub */}
         
        </motion.div>
      </motion.form>
    </motion.div>
  );
}; 