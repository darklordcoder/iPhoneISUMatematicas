import { Graphviz } from 'graphviz-react';
import { useState } from 'react';

export const Dijkstra = () => {
    const [nodeCount, setNodeCount] = useState(7);
    const [initialNode, setInitialNode] = useState(0);
    const [finalNode, setFinalNode] = useState(7);
    const MaxWeight = 30;
    const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const cointToss = () => {
        return Math.random() < 0.5;
    }

    const generateRandomMatrixNoReturn = (rows: number, cols: number) => {
        const matrix: number[][] = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                //si es el mismo nodo no generar retorno
                if (i === j) 
                    row.push(0);
                else 
                {
                    if (j > i) {
                        if (cointToss() || cols <= 3) {
                            //evitar conexion entre primer y ultimo nodo
                            if ((i == 0 && rows - 1 == j) || cols <= 2)
                                row.push(0);
                            else
                                row.push(Math.floor(Math.random() * MaxWeight));
                        }
                        else 
                            row.push(0);
                    }
                    else 
                        row.push(0);
                }
            }
            matrix.push(row);
        }
        return matrix;
    }

    //matriz de adyacencia inicial
    const [adyasenceMatrix, setAdyasenceMatrix] = useState([
        [0, 2, 0, 0, 0, 29, 0],
        [0, 0, 20, 15, 0, 20, 0],
        [0, 0, 0, 0, 18, 29, 5],
        [0, 0, 0, 0, 24, 24, 10],
        [0, 0, 0, 0, 0, 0, 50],
        [0, 0, 0, 0, 0, 0, 27],
        [0, 0, 0, 0, 0, 0, 0]
    ]);

    //algoritmo de dijkstra
    const minimalDistance = (distances: number[], visitado: boolean[]) => {
        //encontrar el nodo con la distancia minima
        let minValue = Infinity;
        //encontrar el indice del nodo con la distancia minima
        let minIndex = -1;
        //recorrer todos los nodos
        for (let v = 0; v < distances.length; v++) {
            //si el nodo no esta visitado y la distancia es menor que el minimo
            if (!visitado[v] && distances[v] <= minValue) {
                //actualizar el minimo
                minValue = distances[v];
                //actualizar el indice del nodo con la distancia minima
                minIndex = v;
            }
        }
        return minIndex;
    }

    const dijkstraAlgorithm = (adyMatrix: number[][], initialNode: number, finalNode: number) => {
        const distance = [];
        const visited = [];
        const firstNode = initialNode ? initialNode : 0;
        const lastNode = finalNode ? finalNode : adyMatrix.length;
        //inicializar distancia y visitado
        for (let i = 0; i < adyMatrix.length; i++) {
            distance[i] = Infinity;
            visited[i] = false;
        }
        //asignar distancia inicial
        distance[firstNode] = 0;
        //recorrer todos los nodos
        for (let i = 0; i < adyMatrix.length - 1; i++) {
            //encontrar el nodo con la distancia minima
            const u = minimalDistance(distance, visited);
            visited[u] = true;
            for (let v = 0; v <= lastNode; v++) {
                //actualizar distancia y path
                if (!visited[v] && adyMatrix[u][v] != 0 && distance[u] != Infinity && distance[u] + adyMatrix[u][v] < distance[v]) {
                    distance[v] = distance[u] + adyMatrix[u][v];
                }
            }
        }
        return { distance };
    }


    //converit matriz de adyacencia a lista de adyacencia en duplas
    const matrixToList = (matriz: number[][]) => {
        const lista = [];
        for (let i = 0; i < matriz.length; i++) {
            const row = [];
            for (let j = 0; j < matriz[i].length; j++) {
                if (matriz[i][j] > 0)
                    row.push({ [nodeLabels[j]]: matriz[i][j] });
            }
            //copnveritr arrary a objeto
            const obj = {};
            row.forEach((item: { [key: string]: number }) => {
                Object.entries(item).forEach(([key, value]) => {
                    (obj as { [key: string]: number })[key] = value;
                });
            });
            const nodo = nodeLabels[i];
            lista.push({ [nodo]: obj });
        }
        return lista;
    }

    //convertir matriz de adyacencia a lista de adyacencia en duplas
    const grafo = adyasenceMatrix.map((row, i) =>
        row.map((col, j) => {
            return { source: nodeLabels[i], target: nodeLabels[j], weight: col }
        }
        ))

    //Renderizar la matriz de adyacencia
    const RenderMatriz = ({ matriz }: { matriz: number[][] }) => {
        //convertir Matriz local en tipo string
        const localMatrix = matriz.map((row) => row.map((col) => col.toString()));
        //traer los nodos hasta el largo de la matriz
        const nodelist = nodeLabels.slice(0, matriz.length);
        nodelist.unshift('')
        // Convertir nodelist a un array de números antes de agregarlo a matrizLocal
        localMatrix.unshift(nodelist);
        return (
            <>
                {localMatrix.map((row, i) => {
                    if (i > 0)
                        row.unshift((nodeLabels[i - 1]))
                    return (
                        <div key={i} className={`grid grid-cols-12 ${i == 0 ? ' font-bold' : 'border-t'}`}>{
                            row.map((col, j) =>
                                <div key={j} className={`p-0 m-1 text-center text-sm ${j == 0 ? ' font-bold' : ''}`}>{col}</div>
                            )
                        }</div>
                    )
                }
                )}
            </>
        );
    };

    //Generar grafo en dot desde lista de adyacencia
    const LitsToDot = (localNodelist: { source: string, target: string, weight: number }[][]) => {
        const dot = `digraph G {
        rankdir=LR;
        node [shape=circle];
            ${localNodelist.map((edge: { source: string, target: string, weight: number }[]) =>
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

    const generateNewGraphClick = () => {
        setAdyasenceMatrix(generateRandomMatrixNoReturn(nodeCount, nodeCount))
        setFinalNode(nodeCount - 1)
        setInitialNode(0)
    }

    const classCardHeader = "p-3 mb-2 bg-gray-300 text-center rounded-xl font-bold text-xl";
    const classCardBody = " p-3 m-2 overflow-hidden bg-white rounded-2xl shadow-lg";

    return (
        <div className='items-center justify-center flex-1 w-full h-screen pt-2 bg-gray-400'>
            <div className='p-2 m-2 bg-white rounded-xl'>
                Cantidad de nodos <input type="number" value={nodeCount} onChange={(e) => setNodeCount(Number(e.target.value))} className='w-20 p-2 m-2 bg-gray-200 rounded-xl' />
                <button
                    onClick={generateNewGraphClick}
                    className='p-3 m-2 text-white bg-blue-800 rounded-xl hover:bg-blue-900'
                >
                    Generar Nuevo Grafo
                </button>
                Nodo Inicial <input type="number" value={initialNode} onChange={(e) => setInitialNode(Number(e.target.value))} className='w-20 p-2 m-2 bg-gray-200 rounded-xl' />
                Nodo Final <input type="number" value={finalNode} onChange={(e) => setFinalNode(Number(e.target.value))} className='w-20 p-2 m-2 bg-gray-200 rounded-xl' />
                <button
                    onClick={() => dijkstraAlgorithm(adyasenceMatrix, initialNode, finalNode)}
                    className='p-3 m-2 text-white bg-blue-800 rounded-xl hover:bg-blue-900'
                >
                    Calcular Distancia Minima
                </button>
            </div>
            <div className='flex-row flex-1'>
                <div className='grid grid-cols-2 gap-0'>
                    <div className={`${classCardBody}`}>
                        <h4 className={classCardHeader}>Grafo</h4>
                        {/* //grafico debe ser maximo 300 px ancho */}
                        <Graphviz dot={LitsToDot(grafo)} options={{ width: '600px', height: '400px' }} />
                    </div>
                    <div className={classCardBody}>
                        <h4 className={classCardHeader}>Matriz de adyacencia</h4>
                        <RenderMatriz matriz={adyasenceMatrix} />
                    </div>
                    <div className={classCardBody + ' text-sm'}>
                        <h4 className={classCardHeader}>Lista de adyacencia</h4>
                        {matrixToList(adyasenceMatrix).map((adyRow, i) => (
                            <div key={i}>
                                {JSON.stringify(adyRow, null, 2)}
                            </div>
                        ))}
                    </div>
                    <div className={classCardBody + ' text-sm'}>
                        <h4 className={classCardHeader}>Distancia minima</h4>
                        {dijkstraAlgorithm(adyasenceMatrix, initialNode, finalNode).distance.map((distance, i) => (
                            <>{distance != Infinity && distance != 0 &&
                                <div key={i}>
                                    {nodeLabels[initialNode]} =&gt;  {nodeLabels[i]}: {distance}
                                </div>
                            }</>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    )
}

