import { Graphviz } from 'graphviz-react';
import { useState } from 'react';
import { json } from 'react-router-dom';

export const Dijkstra = () => {

    const MaxWeight = 30;
    const nodos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    //generar matriz de adyacencia aleatoria no generar retornos entre nodos
    const generateRandomMatrix = (rows: number, cols: number) => {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                //si es el mismo nodo no generar retorno
                if (i === j) {
                    row.push(0);
                } else {
                    row.push(Math.floor(Math.random() * MaxWeight));
                }
            }
            matrix.push(row);
        }
        return matrix;
    }

    const cointToss = () => {
        return Math.random() < 0.5;
    }


    const generateRandomMatrixNoRetorno  = (rows: number, cols: number) => 
    {
        const matrix: never[] = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                //si es el mismo nodo no generar retorno
                if (i === j) {
                    row.push(0);
                } else {
                    if(j>i)
                    {
                        if(cointToss())
                        {
                            row.push(Math.floor(Math.random() * MaxWeight));
                        }
                        else
                        {
                            row.push(0);
                        }
                    }
                    else
                    {
                        row.push(0);
                    }
                }
            }
            matrix.push(row);
        }
        return matrix;
    }

    //matriz de adyacencia
    const [matriz, setMatriz] = useState([
        [0, 8, 3, 0, 0],
        [0, 0, 5, 5, 50],
        [0, 0, 0, 4, 5],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0]
    ]);

    //



    //convertir matriz de adyacencia a lista de adyacencia en duplas
    const lista = matriz.map((row, i) =>
        row.map((col, j) => ({ source: nodos[i], target: nodos[j], weight: col }))
    );

    //Renderizar la matriz de adyacencia
    const RenderMatriz = ({ matriz }: { matriz: number[][] }) => {
        return (
            <>
                {matriz.map((row, i) => (
                    <div key={i} className='flex flex-row justify-between '>{row.map((col, j) => (
                        <div key={j} className='p-2 m-1'>{col}</div>
                    ))}</div>
                ))}
            </>
        );
    };

    //Generar grafo en dot desde lista de adyacencia
    const LitsToDot = (listaNodos: { source: string, target: string, weight: number }[][]) => {
        console.log(JSON.stringify(listaNodos, null, 2));
        const dot = `digraph G {
        rankdir=LR;
        node [shape=circle];
            ${listaNodos.map((edge: { source: string, target: string, weight: number }[]) =>
        edge.map((node: { source: string, target: string, weight: number }) => {
            if (node.weight > 0)
                return `${node.source} -> ${node.target} [label="${node.weight}"]`
        }).join('\n')
    )
            .join('\n')
        }
        }`;
        return dot;
    };






    console.log(JSON.stringify(lista, null, 2));
    console.log(LitsToDot(lista));

    return (
        <div className='items-center justify-center flex-1 w-full h-full bg-gray-400'>
            <button
                onClick={() => setMatriz(generateRandomMatrixNoRetorno(5, 5))}
                className='justify-center flex-1 p-3 m-2 text-white bg-blue-800 rounded-xl hover:bg-blue-900'
            >
                Generar matriz aleatoria
            </button>
            <div className=''>
                <div className='p-3 m-2 overflow-hidden bg-white rounded shadow-lg'>
                    <RenderMatriz matriz={matriz} />
                </div>
                    <div className='p-3 m-2 overflow-hidden bg-white rounded shadow-lg'>
                    {/* //grafico debe ser maximo 300 px ancho */}
                    <Graphviz dot={LitsToDot(lista)} />
                </div>
            </div>
        </div>
    )
}