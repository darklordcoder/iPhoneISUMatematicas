import { Graphviz } from 'graphviz-react';
import { useState } from 'react';
import { json } from 'react-router-dom';

export const Dijkstra = () => {

    const MaxWeight = 30;
     const nodos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //const nodos = ['0', '1', '2', '3', '4', '5', '6','7'];
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
                            //evitar conexion entre primer y ultimo nodo
                            if(i==0 && rows-1==j)
                                row.push(0);
                            else
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
        console.log(matrix);
        return matrix;
    }

    //matriz de adyacencia
    const [matriz, setMatriz] = useState([
        [0, 2, 0, 0, 0, 29, 0],
        [0, 0, 20, 15, 0, 20, 0],
        [0, 0, 0, 0, 18, 29, 5],
        [0, 0, 0, 0, 24, 24, 10],
        [0, 0, 0, 0, 0, 0, 50],
        [0, 0, 0, 0, 0, 0, 27],
        [0, 0, 0, 0, 0, 0, 0]
    ]);

    //convertir


    //algoritmo de dijkstra

    const min = (distancia: number[], visitado: boolean[]) => {
        let min = Infinity;
        let minIndex = -1;

        for(let v=0; v<distancia.length; v++)
        {
            if(!visitado[v] && distancia[v] <= min)
            {
                min = distancia[v];
                minIndex = v;
            }
        }

        return minIndex;
    }


    const DijkstraAlgorithm = (matriz: number[][], nodoInicial: number) => {
        const distancia = [];
        const visitado = [];
        const paths = [];

        for(let i=0; i<matriz.length; i++)
        {
            distancia[i] = Infinity;
            visitado[i] = false;
        }

        distancia[nodoInicial] = 0;

        

        for(let i=0; i<matriz.length-1; i++)
        {

            const path = [];
            const u = min(distancia, visitado);
            visitado[u] = true;

            for(let v=0; v<matriz.length; v++)
            {
                if(!visitado[v] && matriz[u][v] != 0 && distancia[u] != Infinity && distancia[u] + matriz[u][v] < distancia[v])
                {
                    distancia[v] = distancia[u] + matriz[u][v];
                }

            }
            // path.push(u);
            paths.push( {path, distancia: distancia[u], nodo: i,cosa:u});
        }

        // console.log(distancia);
        // console.log("paths",JSON.stringify(paths, null, 2));

        return {distancia, paths};
    }

//converit matriz de adyacencia a lista de adyacencia en duplas
const matrizToLista = (matriz: number[][]) => {
   const lista = [];
   for(let i=0; i<matriz.length; i++)
   {
    const row = [];
      for(let j=0; j<matriz[i].length; j++)
      {
        if(matriz[i][j] > 0)
        row.push({[nodos[j-1]]: matriz[i][j]});
      }
      //copnveritr arrary a objeto
      const obj = {};
      console.log(row);
      for(let j=0; j<row.length; j++)
      {
        obj[row[j].key] = row[j].value;
      }

      const nodo = nodos[i];
      lista.push({[nodo]:obj});
   }
   return lista;
}

   // algormo dijstra entre dos nodos
//    const DijkstraBetweenNodes = (matriz: number[][], nodoInicial: number, nodoFinal: number) => {
//         let distancias={}
//         let anteriores={}
        
//         for (let nodo in matriz)
//        {
//         if(nodo !== nodoInicial)
//             {distancias[nodo]=Infinity}
//         anteriores[nodo]=null
//        }

//        let porVisitar = matriz
    
//    }


// algoritmo de dijkstra entre dos nodos
const DijkstraBetweenNodes = (matriz: number[][], nodoInicial: number, nodoFinal: number) => {

    let distancias={}
    let anteriores={}

    for(let nodo in matriz)
    {
        if(nodo !== nodoInicial)
        {distancias[nodo]=Infinity}
        anteriores[nodo]=null
    }

    let porVisitar = matriz

    while(nodoInicial !== nodoFinal)
    {
        let nodoActual = nodoInicial;
    }   

    return {distancias, anteriores};
}


       




    //convertir matriz de adyacencia a lista de adyacencia en duplas
    const grafo = matriz.map((row, i) =>
        row.map((col, j) => 
            {

                return { source: nodos[i], target: nodos[j], weight: col }
            
        }
        ))

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

console.log("grafo",  JSON.stringify(grafo, null, 2));
//  console.log("lista",  JSON.stringify(matrizToLista(matriz), null, 2));
// console.log("dijkstra",  JSON.stringify(DijkstraBetweenNodes(matriz, 0, 6), null, 2));

    return (
        <div className='items-center justify-center flex-1 w-full h-full bg-gray-400'>
            <button
                onClick={() => setMatriz(generateRandomMatrixNoRetorno(7, 7))}
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
                    <Graphviz dot={LitsToDot(grafo)} />
                    <div className='p-3 m-2 overflow-hidden bg-white rounded shadow-lg'>
                       {DijkstraAlgorithm(matriz,0).distancia.map((distancia, i) => (
                        <div key={i}>
                            {nodos[i]}: {distancia}
                        </div>
                       ))}
                      
                    </div>
                </div>
            </div>
        </div>
    )
}

