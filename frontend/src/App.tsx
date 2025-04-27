import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PhoneFrame } from './components/PhoneFrame';
import { Login } from './components/Login';
import { CitiesList } from './components/CitiesList';
import { ProgrammingLanguages } from './components/ProgrammingLanguages';
import { Menu } from './components/Menu';
import { AnimatePresence } from 'framer-motion';
import HomeScreen from './components/HomeScreen';
import Calculator from './components/Calculator';
import BootScreen from './components/BootScreen';
import Weather from './components/Weather';
import { useState } from 'react';
import { AuthLayout } from './layouts/AuthLayout';
import { Assignments } from './actividades/actividad2/Assigments';
import { Dijkstra } from './actividades/actvidad3/Dijkstra';
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route element={<AuthLayout />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/cities" element={<CitiesList />} />
          <Route path="/programming" element={<ProgrammingLanguages />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/dijkstra" element={<Dijkstra />} />
        </Route>

        {/* Ruta para manejar URLs no encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <Router>
      {/* //si la ruta es dijkstra no usar Phoneframe */}
      {location.pathname === '/dijkstra' ? (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dijkstra" element={<Dijkstra />} />
          </Routes>
        </AnimatePresence>
      ) : (   
        <PhoneFrame>
        <AnimatePresence mode="wait">
          {isBooting ? (
            <BootScreen onBootComplete={() => setIsBooting(false)} />
          ) : (
            <AnimatedRoutes />
          )}
        </AnimatePresence>
      </PhoneFrame> 
      )}
    </Router>
  );
}

export default App;
