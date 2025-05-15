// Implementación de una máquina de Turing para suma binaria
class TuringMachine {
    constructor() {
        // Inicializamos la cinta y la posición
        this.tape = [];
        this.position = 0;
        this.state = 'inicio';
        this.carry = 0; // Para almacenar el acarreo
    }    // Inicializar la cinta con los números binarios a sumar
    setupTape(num1, num2) {
        // Formato: num1+num2=BBBBBBBBBB (10 espacios en blanco después)
        // Usamos el carácter 'B' para las celdas en blanco

        // Guardamos los números originales para referencia
        this.originalNum1 = num1;
        this.originalNum2 = num2;

        // Para una verdadera máquina de Turing que suma bit a bit desde el final,
        // colocamos los números normalmente (no invertidos)
        this.tape = [...num1.split(''), '+', ...num2.split(''), '=', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'];
        this.position = 0;
        this.state = 'inicio';
        this.carry = 0;
    }

    // Leer el símbolo en la posición actual
    read() {
        // Si estamos fuera de los límites de la cinta, devolvemos un espacio en blanco (B)
        if (this.position < 0 || this.position >= this.tape.length) {
            return 'B';
        }
        return this.tape[this.position];
    }

    // Escribir un símbolo en la posición actual
    write(symbol) {
        // Asegurarnos de que la cinta se expande si es necesario
        while (this.position < 0) {
            this.tape.unshift('B');
            this.position = 0;
        }

        while (this.position >= this.tape.length) {
            this.tape.push('B');
        }

        this.tape[this.position] = symbol;
    }

    // Mover el cabezal a la izquierda
    moveLeft() {
        this.position--;
        // Si nos movemos a la izquierda del inicio, expandimos la cinta
        if (this.position < 0) {
            this.tape.unshift('B');
            this.position = 0;
        }
    }

    // Mover el cabezal a la derecha
    moveRight() {
        this.position++;
        // Si nos movemos más allá del final, expandimos la cinta
        if (this.position >= this.tape.length) {
            this.tape.push('B');
        }
    }    // Ejecutar la máquina de Turing para sumar dos números binarios
    run() {
        console.log(`Estado inicial (inicio): ${this.display()}`);

        // Guardar los números originales para referencia
        this.originalNum1 = this.originalNum1 || this.tape.slice(0, this.tape.indexOf('+')).join('');
        this.originalNum2 = this.originalNum2 || this.tape.slice(this.tape.indexOf('+') + 1, this.tape.indexOf('=')).join('');

        // Proceso de suma bit a bit como una verdadera máquina de Turing
        this.state = 'buscar_primer_num_final';  // Estado inicial
        this.carry = 0;     // Inicialmente no hay acarreo

        // Fase 1: Ir al final del primer número (buscar el símbolo +)
        console.log("\nFase 1: Buscar el final del primer número");
        while (this.read() !== '+' && this.state === 'buscar_primer_num_final') {
            console.log(`Estado ${this.state}: ${this.display()}`);
            this.moveRight();
        }

        this.firstNumEnd = this.position - 1; // Guardar la posición del último dígito del primer número
        this.state = 'buscar_segundo_num_final'; // Cambiar al estado de buscar el signo =
        console.log(`Estado ${this.state} (encontrado + en posición ${this.position}): ${this.display()}`);

        // Fase 2: Ir al final del segundo número (buscar el signo =)
        console.log("\nFase 2: Buscar el final del segundo número");
        this.moveRight(); // Moverse más allá del signo +
        while (this.read() !== '=' && this.state === 'buscar_segundo_num_final') {
            console.log(`Estado ${this.state}: ${this.display()}`);
            this.moveRight();
        }

        this.secondNumEnd = this.position - 1; // Guardar la posición del último dígito del segundo número
        this.state = 'iniciar_suma'; // Cambiar al estado de iniciar la suma
        console.log(`Estado ${this.state} (encontrado = en posición ${this.position}): ${this.display()}`);

        // Fase 3: Iniciar la suma desde el final de los números
        console.log("\nFase 3: Preparar para la suma");

        // Buscar los inicios de los números
        this.firstNumStart = 0; // El primer número empieza al inicio de la cinta

        // Encontrar inicio del segundo número (justo después del +)
        for (let i = 0; i < this.tape.length; i++) {
            if (this.tape[i] === '+') {
                this.secondNumStart = i + 1;
                break;
            }
        }

        // Encontrar el inicio del resultado (justo después del =)
        for (let i = 0; i < this.tape.length; i++) {
            if (this.tape[i] === '=') {
                this.resultStart = i + 1;
                break;
            }
        }

        // Inicializar índices para recorrer desde el final
        this.currentIndex1 = this.firstNumEnd;
        this.currentIndex2 = this.secondNumEnd;
        this.currentResultIndex = this.resultStart;

        // Inicializar acarreo
        this.carry = 0;

        this.state = 'sumar_bits';
        console.log(`Estado ${this.state} (listo para sumar): ${this.display()}`);

        // Fase 4: Realizar la suma bit a bit
        console.log("\nFase 4: Realizar la suma bit a bit");

        // Realizamos la suma bit a bit desde los bits menos significativos
        while (this.currentIndex1 >= this.firstNumStart || this.currentIndex2 >= this.secondNumStart || this.carry > 0) {
            // Obtener el bit actual del primer número
            let bit1 = 0;
            if (this.currentIndex1 >= this.firstNumStart) {
                this.position = this.currentIndex1;
                bit1 = this.read() === '1' ? 1 : 0;
                console.log(`Leyendo bit1 (${bit1}) del primer número: ${this.display()}`);
                this.currentIndex1--;
            }

            // Obtener el bit actual del segundo número
            let bit2 = 0;
            if (this.currentIndex2 >= this.secondNumStart) {
                this.position = this.currentIndex2;
                bit2 = this.read() === '1' ? 1 : 0;
                console.log(`Leyendo bit2 (${bit2}) del segundo número: ${this.display()}`);
                this.currentIndex2--;
            }

            // Calcular el resultado de sumar estos bits y el acarreo
            const sum = bit1 + bit2 + this.carry;
            const resultBit = sum % 2;
            const newCarry = Math.floor(sum / 2);

            // Escribir el resultado
            this.position = this.currentResultIndex;
            this.write(resultBit.toString());
            console.log(`Escribiendo bit resultado (${resultBit}), acarreo=${this.carry}: ${this.display()}`);
            this.currentResultIndex++;

            // Actualizar el acarreo para la siguiente iteración
            this.carry = newCarry;
        }

        this.state = 'terminar_suma';
        console.log(`\nEstado ${this.state} (suma completada): ${this.display()}`);

        // Fase 5: Invertir el resultado escrito
        console.log("\nFase 5: Invertir el resultado para mostrar en orden correcto");

        // Determinar el final del resultado
        let resultEnd = this.resultStart;
        while (resultEnd < this.tape.length && this.tape[resultEnd] !== 'B') {
            resultEnd++;
        }

        // Invertir el resultado, ya que se escribió en orden inverso
        const resultArray = this.tape.slice(this.resultStart, resultEnd).reverse();

        // Sobrescribir el resultado en el orden correcto
        for (let i = 0; i < resultArray.length; i++) {
            this.position = this.resultStart + i;
            this.write(resultArray[i]);
        }

        // Fase 6: Asegurar que haya 10 espacios en blanco al final
        console.log("\nFase 6: Asegurar que haya 10 espacios en blanco al final");
        this.state = 'verificando_espacios';

        // Ir al final del resultado
        this.position = resultEnd;
        console.log(`Estado ${this.state}: ${this.display()}`);

        let blankCount = 0;
        for (let i = this.position; i < this.tape.length; i++) {
            if (this.tape[i] === 'B') {
                blankCount++;
            }
        }

        while (blankCount < 10) {
            this.tape.push('B');
            blankCount++;
        }

        // Estado final
        this.state = 'qf';
        console.log(`\nEstado final (${this.state}): ${this.display()}`);

        // Extraer y devolver el resultado
        let result = resultArray.join('');
        this.resultado = result;

        // Verificación
        const expectedResult = (parseInt(this.originalNum1, 2) + parseInt(this.originalNum2, 2)).toString(2);
        console.log(`\nVerificación: ${this.originalNum1}(${parseInt(this.originalNum1, 2)}) + ${this.originalNum2}(${parseInt(this.originalNum2, 2)}) = ${expectedResult}(${parseInt(expectedResult, 2)})`);
        console.log(`Resultado obtenido: ${result}(${parseInt(result, 2)})`);

        if (expectedResult !== result) {
            console.log("ADVERTENCIA: El resultado no coincide con la suma esperada.");
        }

        return result;
    }

    // Algoritmo para la suma binaria
    binaryAddition(num1, num2) {
        let result = '';
        let carry = 0;

        // Recorrer de derecha a izquierda
        for (let i = num1.length - 1; i >= 0; i--) {
            const bit1 = parseInt(num1[i], 2);
            const bit2 = parseInt(num2[i], 2);

            // Realizar la suma
            const sum = bit1 + bit2 + carry;

            // Determinar el bit de resultado y el acarreo
            result = (sum % 2).toString() + result;
            carry = Math.floor(sum / 2);
        }

        // Si queda un acarreo, añadirlo al resultado
        if (carry > 0) {
            result = '1' + result;
        }

        return result;
    }
    // Simula el funcionamiento paso a paso de la máquina de Turing
    simulateSteps() {
        let stepCount = 0;
        const maxSteps = 1000; // Límite para evitar bucles infinitos

        console.log("Simulación paso a paso:");
        console.log(`Estado inicial (${this.state}): ${this.display()}`);

        // Ejecutar la simulación paso a paso
        while (this.state !== 'qf' && stepCount < maxSteps) {
            const continuar = this.step();
            if (!continuar) break;
            stepCount++;
        }

        if (stepCount >= maxSteps) {
            console.log("Se alcanzó el límite máximo de pasos.");
        } else {
            console.log("La máquina se detuvo.");
            console.log(`Estado final (${this.state}): ${this.display()}`);
        }
    }    // Realiza un paso en la simulación de la máquina de Turing
    step() {
        // Si la máquina ya terminó, no hacer nada
        if (this.state === 'qf') return false;

        const symbol = this.read();

        // Lógica de transición basada en el estado actual y el símbolo leído
        switch (this.state) {
            case 'inicio':
                // Estado inicial: comenzar a recorrer la cinta
                this.state = 'buscar_primer_num_final';
                this.carry = 0; // Inicializar el acarreo
                console.log(`Paso: Inicializando (estado ${this.state}): ${this.display()}`);
                return true;

            case 'buscar_primer_num_final':
                // Buscar el signo + para encontrar el final del primer número
                if (symbol === '+') {
                    this.state = 'buscar_segundo_num_final';
                    this.firstNumEnd = this.position - 1; // Guardar la posición del último dígito del primer número
                    console.log(`Paso: Encontrado final del primer número en posición ${this.firstNumEnd} (estado ${this.state}): ${this.display()}`);
                } else {
                    this.moveRight();
                    console.log(`Paso: Buscando final del primer número (estado ${this.state}): ${this.display()}`);
                }
                return true;

            case 'buscar_segundo_num_final':
                // Buscar el signo = para encontrar el final del segundo número
                if (symbol === '=') {
                    this.state = 'iniciar_suma';
                    this.secondNumEnd = this.position - 1; // Guardar la posición del último dígito del segundo número
                    console.log(`Paso: Encontrado final del segundo número en posición ${this.secondNumEnd} (estado ${this.state}): ${this.display()}`);
                } else {
                    this.moveRight();
                    console.log(`Paso: Buscando final del segundo número (estado ${this.state}): ${this.display()}`);
                }
                return true;

            case 'iniciar_suma':
                // Buscar los inicios de los números
                this.firstNumStart = 0; // El primer número empieza al inicio de la cinta

                // Encontrar inicio del segundo número (justo después del +)
                for (let i = 0; i < this.tape.length; i++) {
                    if (this.tape[i] === '+') {
                        this.secondNumStart = i + 1;
                        break;
                    }
                }

                // Encontrar el inicio del resultado (justo después del =)
                for (let i = 0; i < this.tape.length; i++) {
                    if (this.tape[i] === '=') {
                        this.resultStart = i + 1;
                        break;
                    }
                }

                // Inicializar índices para recorrer desde el final
                this.currentIndex1 = this.firstNumEnd;
                this.currentIndex2 = this.secondNumEnd;
                this.currentResultIndex = this.resultStart;

                // Inicializar acarreo
                this.carry = 0;

                this.state = 'sumar_bits';
                console.log(`Paso: Preparando la suma desde el final (estado ${this.state}): ${this.display()}`);
                return true;

            case 'sumar_bits':
                // Verificar si ya terminamos la suma
                if (this.currentIndex1 < this.firstNumStart && this.currentIndex2 < this.secondNumStart && this.carry === 0) {
                    this.state = 'terminar_suma';
                    console.log(`Paso: Suma completada (estado ${this.state}): ${this.display()}`);
                    return true;
                }

                // Obtener el bit actual del primer número
                let bit1 = 0;
                if (this.currentIndex1 >= this.firstNumStart) {
                    this.position = this.currentIndex1;
                    bit1 = this.read() === '1' ? 1 : 0;
                    console.log(`Paso: Leyendo bit1 (${bit1}) del primer número (estado ${this.state}): ${this.display()}`);
                    this.currentIndex1--;
                }

                // Obtener el bit actual del segundo número
                let bit2 = 0;
                if (this.currentIndex2 >= this.secondNumStart) {
                    this.position = this.currentIndex2;
                    bit2 = this.read() === '1' ? 1 : 0;
                    console.log(`Paso: Leyendo bit2 (${bit2}) del segundo número (estado ${this.state}): ${this.display()}`);
                    this.currentIndex2--;
                }

                // Calcular el resultado de sumar estos bits y el acarreo
                const sum = bit1 + bit2 + this.carry;
                const resultBit = sum % 2;
                this.carry = Math.floor(sum / 2);

                // Escribir el resultado
                this.position = this.currentResultIndex;
                this.write(resultBit.toString());
                console.log(`Paso: Escribiendo bit resultado (${resultBit}), acarreo=${this.carry} (estado ${this.state}): ${this.display()}`);
                this.currentResultIndex++;

                // Si solo queda el acarreo y es 1, escribirlo
                if (this.currentIndex1 < this.firstNumStart && this.currentIndex2 < this.secondNumStart && this.carry === 1) {
                    this.position = this.currentResultIndex;
                    this.write('1');
                    console.log(`Paso: Escribiendo acarreo final (1) (estado ${this.state}): ${this.display()}`);
                    this.currentResultIndex++;
                    this.carry = 0;
                }

                return true;

            case 'terminar_suma':
                // Determinar el final del resultado
                let resultEnd = this.resultStart;
                while (resultEnd < this.tape.length && this.tape[resultEnd] !== 'B') {
                    resultEnd++;
                }

                // Invertir el resultado, ya que se escribió en orden inverso
                const resultLength = resultEnd - this.resultStart;
                const resultArray = this.tape.slice(this.resultStart, resultEnd).reverse();

                // Sobrescribir el resultado en el orden correcto
                for (let i = 0; i < resultArray.length; i++) {
                    this.tape[this.resultStart + i] = resultArray[i];
                }

                this.state = 'verificando_espacios';
                console.log(`Paso: Invirtiendo resultado para mostrar en orden correcto (estado ${this.state}): ${this.display()}`);

                // Guardar el resultado para mostrarlo después
                this.resultado = resultArray.join('');
                return true;

            case 'verificando_espacios':
                // Asegurar que hay 10 espacios en blanco al final
                // Encontrar el final del resultado
                let finalResultEnd = this.resultStart;
                while (finalResultEnd < this.tape.length && this.tape[finalResultEnd] !== 'B') {
                    finalResultEnd++;
                }

                this.position = finalResultEnd;

                let blankCount = 0;
                for (let i = finalResultEnd; i < this.tape.length; i++) {
                    if (this.tape[i] === 'B') {
                        blankCount++;
                    }
                }

                while (blankCount < 10) {
                    this.tape.push('B');
                    blankCount++;
                }

                this.state = 'qf'; // Estado final
                console.log(`Paso: Espacios verificados, finalizando (estado ${this.state}): ${this.display()}`);

                // Verificar el resultado calculando la suma directamente para comparar
                const expectedResult = (parseInt(this.originalNum1, 2) + parseInt(this.originalNum2, 2)).toString(2);
                console.log(`Verificación: ${this.originalNum1}(${parseInt(this.originalNum1, 2)}) + ${this.originalNum2}(${parseInt(this.originalNum2, 2)}) = ${expectedResult}(${parseInt(expectedResult, 2)})`);
                console.log(`Resultado obtenido: ${this.resultado}(${parseInt(this.resultado, 2)})`);

                if (expectedResult !== this.resultado) {
                    console.log("ADVERTENCIA: El resultado no coincide con la suma esperada.");
                }

                return false;

            case 'error':
                console.log(`Error en la ejecución de la máquina: ${this.display()}`);
                return false;

            default:
                console.log(`Estado desconocido: ${this.state}`);
                return false;
        }
    }

    // Función para mostrar la cinta con la posición actual marcada
    display() {
        let display = this.tape.slice();

        // Marcar la posición actual
        let currentSymbol = display[this.position];
        display[this.position] = `[${currentSymbol}]`;

        // Convertir a cadena y mostrar en formato de celdas
        //agrega caracter de salto de linea al inicio y al final
        let initialCaracter = "| ";
        if (this.position == 0) initialCaracter = "|"

        return "\n" + initialCaracter + display.join(' · ').replace(/\· \[/g, "·[").replace(/\] \·/g, "]·") + " |\n";

    }
}

// Función principal para uso interactivo de la máquina
function main() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const machine = new TuringMachine();

    function promptForBinaryNumbers() {
        rl.question('Ingrese el primer número binario: ', (num1) => {
            if (!isValidBinary(num1)) {
                console.log('Error: Ingrese un número binario válido (solo 0s y 1s)');
                return promptForBinaryNumbers();
            }

            rl.question('Ingrese el segundo número binario: ', (num2) => {
                if (!isValidBinary(num2)) {
                    console.log('Error: Ingrese un número binario válido (solo 0s y 1s)');
                    return promptForBinaryNumbers();
                }

                console.log(`\nSumando ${num1} + ${num2} con la máquina de Turing`);
                console.log(`Representación decimal: ${parseInt(num1, 2)} + ${parseInt(num2, 2)} = ${parseInt(num1, 2) + parseInt(num2, 2)}\n`);
                machine.setupTape(num1, num2);
                machine.simulateSteps();
                result = machine.resultado || ''; // Obtener el resultado si está disponible
                if (result && result.length > 0) {
                    console.log(`\nResultado en binario: ${result}`);
                    console.log(`Resultado en decimal: ${parseInt(result, 2)}`);
                }

                askContinue();

            });
        });
    }

    function isValidBinary(str) {
        return /^[01]+$/.test(str);
    }

    function askContinue() {
        rl.question('\n¿Desea realizar otra suma? (s/n): ', (answer) => {
            if (answer.toLowerCase() === 's') {
                promptForBinaryNumbers();
            } else {
                console.log('¡Gracias por usar la máquina de Turing para suma binaria!');
                rl.close();
            }
        });
    }

    console.log('=== Máquina de Turing para Suma Binaria ===');
    console.log('Esta máquina suma dos números binarios y muestra el resultado después del signo =');
    console.log('Las celdas en blanco se representan con el símbolo B');
    console.log('Se realiza la suma bit a bit desde el final hacia el inicio, manejando el acarreo');
    console.log('Se añaden 10 espacios en blanco después del resultado\n');

    promptForBinaryNumbers();
}

// Iniciar el programa
main();
