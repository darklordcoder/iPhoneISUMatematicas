import { Graphviz } from "graphviz-react";
import { useState } from "react";

// Definir el tipo para los nodos del árbol
interface TreeNode {
    value: number;
    left?: TreeNode | null;
    right?: TreeNode | null;
}

export const Arboles = () => {
    const [nodeCount, setNodeCount] = useState(20);
    const [maxValue, setMaxValue] = useState(50);
    const [grafo, setGrafo] = useState({});
    const [grafo2, setGrafo2] = useState({});
    const [inorderList, setInorderList] = useState([]);
    const [preorderList, setPreorderList] = useState([]);
    const [postorderList, setPostorderList] = useState([]);
    const [balancerInorderList, setBalancerInorderList  ] = useState([]);
    const [balancerPreorderList, setBalancerPreorderList] = useState([]);
    const [balancerPostorderList, setBalancerPostorderList] = useState([]);

    const [valueToSearch, setValueToSearch] = useState(40);
    const [valueList, setValueList] = useState<number[]>([]);
    //generador de array aleatorio de 
    const generateRandomArray = (nodeCount: number) => {
        return Array.from({ length: nodeCount }, () => Math.floor(Math.random() * maxValue));
    }

    //post 
    const fetchData = async () => {
        const url = 'api/actividad4';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ valueList: valueList, valueToSearch: valueToSearch })
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setGrafo(data.data.balancedTree);
            setGrafo2(data.data.tree);
            setInorderList(data.data.inorderList);
            setPreorderList(data.data.preorderList);
            setPostorderList(data.data.postorderList);
            setBalancerInorderList(data.data.balancedInorderList);
            setBalancerPreorderList(data.data.balancedPreorderList);
            setBalancerPostorderList(data.data.balancedPostorderList);
            return data;
        } else {
            console.error('Error al obtener los datos');
            return null;
        }
    }

    function jsonToDot(tree: TreeNode | null | undefined) {
        let dot = 'graph G {\n';
        function traverse(node: TreeNode | null | undefined) {
            if (!node) return;
            if (node.left) {
                dot += `  ${node.value} -- ${node.left.value} [color=blue];\n`;
                traverse(node.left);
            }
            if (node.right) {
                dot += `  ${node.value} -- ${node.right.value} [color=red];\n`;
                traverse(node.right);
            }
        }
        traverse(tree);
        dot += '}';
        return dot;
    }

    const generateValues = () => {
        setValueList(generateRandomArray(nodeCount));
    }

    const handleValueListChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Permitir solo números y comas
        const value = e.target.value.replace(/[^0-9,\s]/g, '');
        const arr = value.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
        setValueList(arr);
    };

    const buttonStyle = 'px-6 py-3 m-2 text-white bg-blue-800 rounded-xl hover:bg-blue-900 transition-colors duration-200 shadow-lg hover:shadow-xl';

    return (
        <div className="min-h-screen p-8 bg-gray-400">
            <div className="mx-auto max-w-7xl">

                
                <div className="p-2 mb-4 bg-white shadow-lg rounded-xl">
                   
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        <div className="flex flex-col items-start">
                            <label className="mb-1 font-medium text-gray-700">Valores generados (edítalos separados por coma):</label>
                            <input
                                type="text"
                                className="p-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                value={valueList.join(', ')}
                                onChange={handleValueListChange}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <label className="mb-1 font-medium text-gray-700">Valor a buscar:</label>
                            <input
                                type="number"
                                className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                value={valueToSearch}
                                onChange={e => setValueToSearch(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <label className="mb-1 font-medium text-gray-700">Cantidad de nodos:</label>
                            <input
                                type="number"
                                min={1}
                                className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                value={nodeCount}
                                onChange={e => setNodeCount(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <label className="mb-1 font-medium text-gray-700">Valor máximo:</label>
                            <input
                                type="number"
                                min={1}
                                className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                value={maxValue}
                                onChange={e => setMaxValue(Number(e.target.value))}
                            />
                        </div>
                         <button className={buttonStyle} onClick={generateValues}>
                            Generar Valores <i className="fa-solid fa-rotate-right"></i>
                        </button>
                        <button className={buttonStyle} onClick={fetchData}>
                            Generar Árboles
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Árbol Original */}
                    <div className="p-6 bg-white shadow-lg rounded-xl">
                        <h4 className="mb-4 text-lg font-semibold text-center text-gray-800">Árbol Original</h4>
                        <div className="p-4 mb-6 border rounded-lg">
                            <Graphviz dot={jsonToDot((grafo2 && (grafo2 as TreeNode).value !== undefined) ? (grafo2 as TreeNode) : null)} options={{ width: '100%', height: '350px' }} />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Inorder</h3>
                                <p className="text-gray-600">{inorderList.join(', ')}</p>
                            </div>
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Preorder</h3>
                                <p className="text-gray-600">{preorderList.join(', ')}</p>
                            </div>
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Postorder</h3>
                                <p className="text-gray-600">{postorderList.join(', ')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Árbol Balanceado */}
                    <div className="p-6 bg-white shadow-lg rounded-xl">
                        <h4 className="mb-4 text-lg font-semibold text-center text-gray-800">Árbol Balanceado</h4>
                        <div className="p-4 mb-6 border rounded-lg 0">
                            <Graphviz dot={jsonToDot((grafo && (grafo as TreeNode).value !== undefined) ? (grafo as TreeNode) : null)} options={{ width: '100%', height: '350px'}} />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Inorder</h3>
                                <p className="text-gray-600">{balancerInorderList.join(', ')}</p>
                            </div>
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Preorder</h3>
                                <p className="text-gray-600">{balancerPreorderList.join(', ')}</p>
                            </div>
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Postorder</h3>
                                <p className="text-gray-600">{balancerPostorderList.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
