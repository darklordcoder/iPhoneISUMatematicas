/**
 * Juego del Ahorcado utilizando Autómatas Finitos
 * Implementación en Node.js
 * 
 * Este juego implementa un ahorcado tradicional utilizando la teoría de autómatas finitos
 * para manejar los estados del juego y las transiciones entre ellos.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Ruta al archivo donde se guardarán las palabras del juego
const WORDS_FILE = path.join(__dirname, 'words.json');

// Lista inicial de palabras relacionadas con autómatas y computación
let words = [
    "algoritmo", "automata", "estado", "alfabeto", "cadena", "simbolo", 
    "gramatica", "lenguaje", "transicion", "nodos", "compilador", 
    "produccion", "derivacion", "semantica", "sintaxis", "computacion"
];

/**
 * Carga las palabras desde el archivo de almacenamiento
 * Si el archivo no existe, crea uno nuevo con las palabras predeterminadas
 */
function loadWords() {
    try {
        if (fs.existsSync(WORDS_FILE)) {
            const data = fs.readFileSync(WORDS_FILE, 'utf8');
            words = JSON.parse(data);
        } else {
            // Si el archivo no existe, crear uno con las palabras predeterminadas
            saveWords();
        }
    } catch (error) {
        console.error('Error al cargar las palabras:', error);
    }
}

/**
 * Guarda la lista actual de palabras en el archivo de almacenamiento
 */
function saveWords() {
    try {
        fs.writeFileSync(WORDS_FILE, JSON.stringify(words, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar las palabras:', error);
    }
}

/**
 * Clase Automata - Representa el autómata finito para el juego
 * Implementa la definición formal de un autómata: M = (Q, Σ, δ, q0, F)
 * donde:
 * - Q: conjunto de estados (estados del juego)
 * - Σ: alfabeto de entrada (letras válidas)
 * - δ: función de transición (cambios de estado)
 * - q0: estado inicial (inicio del juego)
 * - F: conjunto de estados finales (victoria o derrota)
 */
class Automaton {
    constructor(secretWord) {
        // Alfabeto válido para el juego (símbolos de entrada permitidos)
        this.alphabet = 'abcdefghijklmnñopqrstuvwxyz';
        
        // Palabra secreta a adivinar (convertida a minúsculas)
        this.secretWord = secretWord.toLowerCase();
        
        // Estado inicial del juego:
        // - Ninguna letra adivinada
        // - Sin letras incorrectas
        // - 6 intentos disponibles
        // - Juego no terminado
        // - Sin victoria
        this.currentState = {
            guessedLetters: new Set(),
            incorrectLetters: new Set(),
            remainingAttempts: 6,
            gameOver: false,
            victory: false
        };
    }

    /**
     * Función de transición δ que determina el siguiente estado
     * basado en el estado actual y la entrada (letra)
     * @param {string} letter - La letra ingresada por el jugador
     * @returns {Object} El nuevo estado del juego
     */
    transition(letter) {
        // Validar que la letra pertenezca al alfabeto válido
        if (!this.alphabet.includes(letter.toLowerCase())) {
            return this.currentState; // No hay cambio de estado
        }

        letter = letter.toLowerCase();
        
        // Si la letra ya fue intentada, mantener el estado actual
        if (this.currentState.guessedLetters.has(letter) || 
            this.currentState.incorrectLetters.has(letter)) {
            return this.currentState;
        }
        
        // Crear nuevo estado (copia profunda del estado actual)
        const newState = {
            guessedLetters: new Set(this.currentState.guessedLetters),
            incorrectLetters: new Set(this.currentState.incorrectLetters),
            remainingAttempts: this.currentState.remainingAttempts,
            gameOver: false,
            victory: false
        };
        
        // Procesar la letra ingresada
        if (this.secretWord.includes(letter)) {
            // Letra correcta: agregar a letras adivinadas
            newState.guessedLetters.add(letter);
            
            // Verificar si se completó la palabra
            const allGuessed = [...this.secretWord].every(character => 
                newState.guessedLetters.has(character));
            
            if (allGuessed) {
                newState.gameOver = true;
                newState.victory = true;
            }
        } else {
            // Letra incorrecta: reducir intentos y agregar a letras incorrectas
            newState.incorrectLetters.add(letter);
            newState.remainingAttempts--;
            
            // Verificar si se acabaron los intentos
            if (newState.remainingAttempts <= 0) {
                newState.gameOver = true;
                newState.victory = false;
            }
        }
        
        // Actualizar y retornar el nuevo estado
        this.currentState = newState;
        return this.currentState;
    }

    /**
     * Verifica si el estado actual es un estado final (juego terminado)
     * @returns {boolean} true si el juego ha terminado
     */
    isFinalState() {
        return this.currentState.gameOver;
    }

    /**
     * Obtiene la representación actual de la palabra
     * Muestra guiones para las letras no adivinadas
     * @returns {string} Palabra con formato para mostrar
     */
    getDisplayWord() {
        return [...this.secretWord]
            .map(letter => this.currentState.guessedLetters.has(letter) ? letter : '_')
            .join(' ');
    }
    
    /**
     * Dibuja el ahorcado según los intentos restantes
     * Utiliza caracteres ASCII para representar visualmente el estado del juego
     * @returns {string} Representación ASCII del ahorcado
     */
    drawHangman() {
        const failedAttempts = 6 - this.currentState.remainingAttempts;
        const hangmanStages = [
            `
  +---+
  |   |
      |
      |
      |
      |
=========`,
            `
  +---+
  |   |
      |
      |
      |
      |
=========`,
            `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
            `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
            `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
            `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
            `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
        ];
        
        return hangmanStages[failedAttempts];
    }
}

/**
 * Clase principal del juego que maneja la interacción con el usuario
 * y la lógica de flujo del juego
 */
class HangmanGame {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // Cargar palabras al iniciar
        loadWords();
        
        this.showMainMenu();
    }
    
    /**
     * Muestra el menú principal
     */
    showMainMenu() {
        console.clear();
        console.log('\n===== JUEGO DEL AHORCADO UTILIZANDO AUTÓMATAS =====\n');
        console.log('1. Iniciar juego');
        console.log('2. Administrar palabras');
        console.log('3. Salir');
        
        this.rl.question('\nSelecciona una opción (1-3): ', (option) => {
            switch(option) {
                case '1':
                    this.startGame();
                    break;
                case '2':
                    this.authenticateAdmin();
                    break;
                case '3':
                    console.log('\n¡Gracias por jugar!\n');
                    this.rl.close();
                    break;
                default:
                    console.log('\nOpción no válida. Por favor, selecciona una opción del 1 al 3.');
                    setTimeout(() => this.showMainMenu(), 2000);
            }
        });
    }

    /**
     * Autentica al administrador antes de mostrar el menú de administración
     */
    authenticateAdmin() {
        console.clear();
        console.log('\n===== ACCESO ADMINISTRATIVO =====\n');
        
        this.rl.question('Ingresa la contraseña: ', (password) => {
            if (password === 'p@ssw0rd') {
                this.showAdminMenu();
            } else {
                console.log('\nContraseña incorrecta.');
                setTimeout(() => this.showMainMenu(), 2000);
            }
        });
    }

    /**
     * Muestra el menú de administración de palabras
     */
    showAdminMenu() {
        console.clear();
        console.log('\n===== ADMINISTRACIÓN DE PALABRAS =====\n');
        console.log('1. Ver palabras existentes');
        console.log('2. Agregar nuevas palabras');
        console.log('3. Volver al menú principal');
        
        this.rl.question('\nSelecciona una opción (1-3): ', (option) => {
            switch(option) {
                case '1':
                    this.showWords();
                    break;
                case '2':
                    this.addNewWord();
                    break;
                case '3':
                    this.showMainMenu();
                    break;
                default:
                    console.log('\nOpción no válida. Por favor, selecciona una opción del 1 al 3.');
                    setTimeout(() => this.showAdminMenu(), 2000);
            }
        });
    }

    /**
     * Muestra la lista de palabras existentes
     */
    showWords() {
        console.clear();
        console.log('\n===== PALABRAS DISPONIBLES =====\n');
        console.log(`Total de palabras: ${words.length}\n`);
        console.log(words.sort().join(', '));
        
        this.rl.question('\nPresiona Enter para volver al menú de administración...', () => {
            this.showAdminMenu();
        });
    }

    /**
     * Permite agregar una o más palabras nuevas
     */
    addNewWord() {
        console.clear();
        console.log('\n===== AGREGAR NUEVAS PALABRAS =====\n');
        console.log('Instrucciones:');
        console.log('- Puedes ingresar una o más palabras');
        console.log('- Separa las palabras por comas o espacios');
        console.log('- Cada palabra debe tener más de 4 letras');
        console.log('- Solo se permiten letras (a-z, ñ)\n');
        
        this.rl.question('Ingresa las palabras: ', (input) => {
            // Convertir la entrada a minúsculas y dividir por comas o espacios
            const newWords = input.toLowerCase()
                .split(/[,\s]+/)
                .map(word => word.trim())
                .filter(word => word.length > 0);

            const results = {
                added: [],
                invalid: [],
                duplicate: []
            };

            // Procesar cada palabra
            newWords.forEach(word => {
                // Validar longitud mínima
                if (word.length <= 4) {
                    results.invalid.push(`${word} (muy corta)`);
                    return;
                }

                // Validar que solo contenga letras
                if (!/^[a-zñ]+$/.test(word)) {
                    results.invalid.push(`${word} (contiene caracteres no válidos)`);
                    return;
                }

                // Validar duplicados
                if (words.includes(word)) {
                    results.duplicate.push(word);
                    return;
                }

                // Agregar palabra válida
                words.push(word);
                results.added.push(word);
            });

            // Guardar cambios si se agregaron palabras
            if (results.added.length > 0) {
                saveWords();
            }

            // Mostrar resultados
            console.clear();
            console.log('\n===== RESULTADO DE LA OPERACIÓN =====\n');

            if (results.added.length > 0) {
                console.log('Palabras agregadas exitosamente:');
                console.log(results.added.join(', '));
                console.log();
            }

            if (results.invalid.length > 0) {
                console.log('Palabras inválidas:');
                console.log(results.invalid.join(', '));
                console.log();
            }

            if (results.duplicate.length > 0) {
                console.log('Palabras duplicadas (no se agregaron):');
                console.log(results.duplicate.join(', '));
                console.log();
            }

            this.rl.question('\nPresiona Enter para volver al menú de administración...', () => {
                this.showAdminMenu();
            });
        });
    }
    
    /**
     * Inicia una nueva partida
     */
    startGame() {
        // Seleccionar palabra aleatoria
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        // Crear instancia del autómata con la palabra seleccionada
        this.automaton = new Automaton(randomWord);
        
        console.clear();
        console.log('\n===== JUEGO DEL AHORCADO UTILIZANDO AUTÓMATAS =====\n');
        console.log('Adivina la palabra relacionada con la teoría de autómatas y computación\n');
        
        this.showGameState();
        this.askForLetter();
    }
    
    /**
     * Muestra el estado actual del juego
     */
    showGameState() {
        console.log(this.automaton.drawHangman());
        console.log(`\nPalabra: ${this.automaton.getDisplayWord()}`);
        console.log(`\nLetras incorrectas: ${[...this.automaton.currentState.incorrectLetters].join(', ')}`);
        console.log(`Intentos restantes: ${this.automaton.currentState.remainingAttempts}`);
    }
    
    /**
     * Pide al usuario que ingrese una letra
     */
    askForLetter() {
        if (this.automaton.isFinalState()) {
            this.endGame();
            return;
        }
        
        this.rl.question('\nIngresa una letra: ', (letter) => {
            if (letter.length !== 1) {
                console.log('Por favor, ingresa una sola letra.');
                this.askForLetter();
                return;
            }
            
            // Aplicar la transición del autómata con la letra ingresada
            this.automaton.transition(letter);
            
            console.clear();
            console.log('\n===== JUEGO DEL AHORCADO UTILIZANDO AUTÓMATAS =====\n');
            this.showGameState();
            
            // Verificar si se ha llegado a un estado final
            this.askForLetter();
        });
    }
    
    /**
     * Finaliza el juego mostrando el resultado
     */
    endGame() {
        console.log('\n========================================');
        
        if (this.automaton.currentState.victory) {
            console.log('¡FELICIDADES! Has adivinado la palabra:');
            console.log(`\n${this.automaton.secretWord.toUpperCase()}\n`);
        } else {
            console.log('¡GAME OVER! Te has quedado sin intentos.');
            console.log(`\nLa palabra era: ${this.automaton.secretWord.toUpperCase()}\n`);
        }
        
        this.rl.question('Presiona Enter para volver al menú principal...', () => {
            this.showMainMenu();
        });
    }
}

// Iniciar el juego
new HangmanGame(); 