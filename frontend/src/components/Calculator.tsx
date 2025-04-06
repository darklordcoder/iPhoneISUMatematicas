import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Calculator = () => {
  const navigate = useNavigate();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const buttons = [
    { value: 'AC', type: 'function', color: 'bg-gray-300 hover:bg-gray-400' },
    { value: '±', type: 'function', color: 'bg-gray-300 hover:bg-gray-400' },
    { value: '%', type: 'function', color: 'bg-gray-300 hover:bg-gray-400' },
    { value: '÷', type: 'operator', color: 'bg-orange-400 hover:bg-orange-500 text-white' },
    { value: '7', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '8', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '9', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '×', type: 'operator', color: 'bg-orange-400 hover:bg-orange-500 text-white' },
    { value: '4', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '5', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '6', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '-', type: 'operator', color: 'bg-orange-400 hover:bg-orange-500 text-white' },
    { value: '1', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '2', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '3', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '+', type: 'operator', color: 'bg-orange-400 hover:bg-orange-500 text-white' },
    { value: '0', type: 'number', color: 'bg-gray-200 hover:bg-gray-300', span: 2 },
    { value: '.', type: 'number', color: 'bg-gray-200 hover:bg-gray-300' },
    { value: '=', type: 'operator', color: 'bg-orange-400 hover:bg-orange-500 text-white' }
  ];

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    if (op === '=') {
      calculate();
    } else {
      setPreviousValue(display);
      setOperation(op);
      setShouldResetDisplay(true);
    }
  };

  const calculate = () => {
    if (!previousValue || !operation) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      case '%':
        result = (prev * current) / 100;
        break;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
  };

  const handleFunction = (func: string) => {
    switch (func) {
      case 'AC':
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        break;
      case '±':
        setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
        break;
      case '%':
        setDisplay((parseFloat(display) / 100).toString());
        break;
    }
  };

  const handleClick = (value: string, type: string) => {
    switch (type) {
      case 'number':
        handleNumber(value);
        break;
      case 'operator':
        handleOperator(value);
        break;
      case 'function':
        handleFunction(value);
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="h-full bg-black p-4 flex flex-col"
    >
      <motion.button
        onClick={() => navigate('/menu')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-16 left-4 w-10 h-10 rounded-full bg-gray-600/70 backdrop-blur-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <div className="flex-1 flex items-end justify-end pb-4">
        <motion.span
          key={display}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-light text-white"
        >
          {display}
        </motion.span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button, index) => (
          <motion.button
            key={button.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.05 }
            }}
            onClick={() => handleClick(button.value, button.type)}
            className={`
              h-16 rounded-full text-xl font-medium
              ${button.color}
              ${button.span ? 'col-span-2' : ''}
              ${button.span ? 'text-left pl-6' : 'text-center'}
            `}
          >
            {button.value}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Calculator; 