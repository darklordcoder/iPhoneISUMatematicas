import { Graphviz } from 'graphviz-react';
import { useState } from 'react';


class Graph {
    nodes: { [key: string]: boolean };
    edges: { [key: string]: { [key: string]: number } };
    constructor() {
      this.nodes = {};
      this.edges = {};
    }
  
    // Añadir un nodo al grafo
    addNode(node: string) {
      if (!this.nodes[node]) {
        this.nodes[node] = true;
        this.edges[node] = {};
      }
    }
  
    // Añadir una arista con peso entre dos nodos
    addEdge(node1: string, node2: string, weight: number) {
        // Verificar que el peso sea un número positivo
        if (typeof weight !== 'number' || weight < 0) {
          throw new Error('El peso debe ser un número positivo');
        }
        
        this.addNode(node1);
        this.addNode(node2);
        this.edges[node1][node2] = weight;
        // Si el grafo es no dirigido, descomenta la siguiente línea
        // this.edges[node2][node1] = weight;
      }
      
  
    // Obtener todos los nodos vecinos de un nodo
    getNeighbors(node: string) {
      return Object.keys(this.edges[node]);
    }
  
    // Obtener el peso de una arista entre dos nodos
    getWeight(node1: string, node2: string) {
      return this.edges[node1][node2];
    }
  }

  function dijkstra(graph: Graph, startNode: string) {
    // Inicializar distancias
    const distances: { [key: string]: number }   = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();
    
    // Inicializar todos los nodos con distancia infinita
    Object.keys(graph.nodes).forEach(node => {
      distances[node] = Infinity;
      previous[node] = null;
      unvisited.add(node);
    });
    
    // La distancia del nodo inicial a sí mismo es 0
    distances[startNode] = 0;
    
    while (unvisited.size > 0) {
      // Encontrar el nodo no visitado con la menor distancia
      let current = null;
      let minDistance = Infinity;
      
      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }
      
      // Si no hay más nodos accesibles, salir del bucle
      if (current === null || distances[current] === Infinity) {
        break;
      }
      
      // Marcar el nodo como visitado
      unvisited.delete(current);
      
      // Actualizar las distancias de los vecinos
      for (const neighbor of graph.getNeighbors(current)) {
        if (unvisited.has(neighbor)) {
          const alt = distances[current] + graph.getWeight(current, neighbor);
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = current;
          }
        }
      }
    }
    
    return { distances, previous };
  }
  
  // Función para reconstruir el camino más corto
  function getShortestPath(previous: { [key: string]: string | null }, endNode: string) {
    const path = [];
    let current : string | null = endNode;
    
    while (current !== null) {
      path.unshift(current);
      if (previous[current] !== null) {
        current = previous[current];
      } else {
        break;
      }
    }
    
    return path;
  }

  function findShortestPath(graph: Graph, startNode: string, endNode: string) {
    if (!graph.nodes[startNode]) {
      throw new Error(`El nodo de inicio "${startNode}" no existe en el grafo`);
    }
    
    if (!graph.nodes[endNode]) {
      throw new Error(`El nodo de destino "${endNode}" no existe en el grafo`);
    }
    
    const { distances, previous } = dijkstra(graph, startNode);
    
    if (distances[endNode] === Infinity) {
      return {
        distance: Infinity,
        path: [],
        message: `No existe un camino desde "${startNode}" hasta "${endNode}"`
      };
    }
    
    return {
      distance: distances[endNode],
      path: getShortestPath(previous, endNode)
    };
  }
  
  function visualizeResult(result: { distance: number, path: string[], message: string | undefined }) {
    if (result.distance === Infinity) {
      console.log(result.message);
      return;
    }
    
    console.log(`Camino más corto: ${result.path.join(' -> ')}`);
    console.log(`Longitud total: ${result.distance}`);
  }

export const Dijkstra = () => {
    const [nodeCount, setNodeCount] = useState(7);
    const [initialNode, setInitialNode] = useState(0);
    const [finalNode, setFinalNode] = useState(7);
    const [shortestPath, setShortestPath] = useState<string[]>([]);
    const [shortestPathMessage2, setShortestPathMessage2] = useState<string>("");
    const [shortestDistance, setShortestDistance] = useState<string>("");
    const [shortestPathMessage, setShortestPathMessage] = useState<string>("");
    const MaxWeight = 30;
    const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const cointToss = () => {
        return Math.random() < 0.5;
    }

    const [graph, setGraph] = useState<Graph>();

    const generateRandomMatrixNoReturn = (rows: number, cols: number) => {
        const matrix: number[][] = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                //si es el mismo nodo no generar retorno
                if (i === j)
                    row.push(0);
                else {
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
    // const minimalDistance = (distances: number[], visitado: boolean[]) => {
    //     //encontrar el nodo con la distancia minima
    //     let minValue = Infinity;
    //     //encontrar el indice del nodo con la distancia minima
    //     let minIndex = -1;
    //     //recorrer todos los nodos
    //     for (let v = 0; v < distances.length; v++) {
    //         //si el nodo no esta visitado y la distancia es menor que el minimo
    //         if (!visitado[v] && distances[v] <= minValue) {
    //             //actualizar el minimo
    //             minValue = distances[v];
    //             //actualizar el indice del nodo con la distancia minima
    //             minIndex = v;
    //         }
    //     }
    //     return minIndex;
    // }

    // const dijkstraAlgorithm = (adyMatrix: number[][], initialNode: number, finalNode: number) => {
    //     const distance = [];
    //     const visited = [];
    //     const firstNode = initialNode ? initialNode : 0;
    //     const lastNode = finalNode ? finalNode : adyMatrix.length;
    //     //inicializar distancia y visitado
    //     for (let i = 0; i < adyMatrix.length; i++) {
    //         distance[i] = Infinity;
    //         visited[i] = false;
    //     }
    //     //asignar distancia inicial
    //     distance[firstNode] = 0;
    //     //recorrer todos los nodos
    //     for (let i = 0; i < adyMatrix.length - 1; i++) {
    //         //encontrar el nodo con la distancia minima
    //         const u = minimalDistance(distance, visited);
    //         visited[u] = true;
    //         for (let v = 0; v <= lastNode; v++) {
    //             //actualizar distancia y path
    //             if (!visited[v] && adyMatrix[u][v] != 0 && distance[u] != Infinity && distance[u] + adyMatrix[u][v] < distance[v]) {
    //                 distance[v] = distance[u] + adyMatrix[u][v];
    //             }
    //         }
    //     }
    //     return { distance };
    // }

    //converit matriz de adyacencia a lista de adyacencia en duplas
    // const matrixToList = (matriz: number[][]) => {
    //     const lista = [];
    //     for (let i = 0; i < matriz.length; i++) {
    //         const row = [];
    //         for (let j = 0; j < matriz[i].length; j++) {
    //             if (matriz[i][j] > 0)
    //                 row.push({ [nodeLabels[j]]: matriz[i][j] });
    //         }
    //         //copnveritr arrary a objeto
    //         const obj = {};
    //         row.forEach((item: { [key: string]: number }) => {
    //             Object.entries(item).forEach(([key, value]) => {
    //                 (obj as { [key: string]: number })[key] = value;
    //             });
    //         });
    //         const nodo = nodeLabels[i];
    //         lista.push({ [nodo]: obj });
    //     }
    //     return lista;
    // }

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
                // console.log(JSON.stringify(shortestPath))
                // console.log(node.target, shortestPath?.indexOf(node.target))
                // console.log(node.source, shortestPath?.indexOf(node.source))

                const color = shortestPath?.includes(node.source) && shortestPath?.includes(node.target) && shortestPath?.indexOf(node.source) == shortestPath?.indexOf(node.target)-1 ? "[color=red,penwidth=3.0]" : "";
                if (node.weight > 0)
                    return `${node.source} -> ${node.target} [label="${node.weight}"] ${color}`
            }).join('\n')
        )
                .join('\n')
            }
        }`;
        return dot;
    };

    const generateNewGraphClick = () => {
        setAdyasenceMatrix(generateRandomMatrixNoReturn(nodeCount, nodeCount))
        setGraph(undefined)
        setShortestPath([])
        setShortestPathMessage2("")
        setShortestDistance("")
        setShortestPathMessage("")
        setFinalNode(nodeCount - 1)
        setInitialNode(0)
        
    }

    const newGraph = ()=>{
        const graph = new Graph();
        for (let i = 0; i < adyasenceMatrix.length; i++) {
            for (let j = 0; j < adyasenceMatrix[i].length; j++) {
                if (adyasenceMatrix[i][j] > 0)
                    graph.addEdge(nodeLabels[i], nodeLabels[j], adyasenceMatrix[i][j]);
            }
        }

        const result : { distance: number, path: string[], message: string | undefined } = findShortestPath(graph, nodeLabels[initialNode], nodeLabels[finalNode]);
        console.log(graph.edges);
        setGraph(graph);
        setShortestPath(result.path);
        setShortestPathMessage2("Camino mas corto: " + result.path.join(' -> '));
        setShortestDistance("Distancia minima: " + result.distance);
        setShortestPathMessage(result.message ? "Mensaje: " + result.message : "");
        
        visualizeResult(result);

        
        return graph;
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
                    onClick={() => newGraph()}
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
                        {Object.entries(graph?.edges || {}).map(([key, value]) => (
                            <div key={key}>
                                {key}: {JSON.stringify(value, null, 2)}
                            </div>
                        ))}
                    </div>
                    <div className={classCardBody + ' text-sm'}>
                        <h4 className={classCardHeader}>Distancia minima</h4>
                        {/* {dijkstraAlgorithm(adyasenceMatrix, initialNode, finalNode).distance.map((distance, i) => (
                            <>{distance != Infinity && distance != 0 &&
                                <div key={i}>
                                    {nodeLabels[initialNode]} =&gt;  {nodeLabels[i]}: {distance}
                                </div>
                            }</>
                        ))} */}
                        {shortestDistance}<br/> {shortestPathMessage2}<br/> {shortestPathMessage}
                    </div>
                </div>

            </div>
        </div>
    )
}

