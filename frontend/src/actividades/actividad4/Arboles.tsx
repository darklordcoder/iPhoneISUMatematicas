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
    const [balancedBinaryTree, setBalancedBinaryTree] = useState({});
    const [binaryTree2, setBinaryTree2] = useState({});
    const [inorderList, setInorderList] = useState([]);
    const [preorderList, setPreorderList] = useState([]);
    const [postorderList, setPostorderList] = useState([]);
    const [balancedInorderList, setBalancedInorderList  ] = useState([]);
    const [balancedPreorderList, setBalancedPreorderList] = useState([]);
    const [balancedPostorderList, setBalancedPostorderList] = useState([]);

    const [valueToSearch, setValueToSearch] = useState(40);
    const [valueList, setValueList] = useState<number[]>([]);
    const [searchResult, setSearchResult] = useState<null | boolean>(null);
    //generador de array aleatorio de 
    const generateRandomArray = (nodeCount: number) => {
        return Array.from({ length: nodeCount }, () => Math.floor(Math.random() * maxValue));
    }

    //post 
    const fetchTreeProcess = async () => {
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
            setBinaryTree2(data.data.treeStructure.tree);
            setBalancedBinaryTree(data.data.balancedTreeStructure.tree);
            setInorderList(data.data.treeStructure.inorderList);
            setPreorderList(data.data.treeStructure.preorderList);
            setPostorderList(data.data.treeStructure.postorderList);
            setBalancedInorderList(data.data.balancedTreeStructure.inorderList);
            setBalancedPreorderList(data.data.balancedTreeStructure.preorderList);
            setBalancedPostorderList(data.data.balancedTreeStructure.postorderList);
            setSearchResult(data.data.treeStructure.searchResult);
            return data;
        } else {
            console.error('Error al obtener los datos');
            setSearchResult(null);
            return null;
        }
    }

    function jsonToDot(tree: TreeNode | null | undefined) {
        let dot = 'graph G {\n';
        function traverse(node: TreeNode | null | undefined) {
            if (!node) return;
            if (node.left) {
                dot += `  ${node.value} -- ${node.left.value} [color=blue, penwidth=3];\n`;
                traverse(node.left);
            }
            if (node.right) {
                dot += `  ${node.value} -- ${node.right.value} [color=red, penwidth=3];\n`;
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

    const addValues = async () => {
        const url = 'api/actividad4/addValues';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ valueList: valueList })
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data.data);

            setBinaryTree2(data.data.treeStructure.tree);
            setBalancedBinaryTree(data.data.balancedTreeStructure.tree);
            setSearchResult(data.data.treeStructure.searchResult);
            setInorderList(data.data.treeStructure.inorderList);
            setPreorderList(data.data.treeStructure.preorderList);
            setPostorderList(data.data.treeStructure.postorderList);    
            setBalancedInorderList(data.data.balancedTreeStructure.inorderList);
            setBalancedPreorderList(data.data.balancedTreeStructure.preorderList);
            setBalancedPostorderList(data.data.balancedTreeStructure.postorderList);
        } else {
            console.error('Error al agregar los valores');
        }
    }

    const buttonStyle = 'px-6 py-3 m-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl';

    return (
        <div className="min-h-screen p-2 bg-gray-400">
            <div className="mx-auto max-w-7xl">

                
                <div className="p-2 mb-4 bg-white shadow-lg rounded-xl">
                    {/* Panel de resultado de búsqueda */}
                  
                    <div className="flex flex-wrap justify-center gap-2 mb-2">
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
                            <label className="mb-1 font-medium text-gray-700">Buscar:</label>
                            <input
                                type="number"
                                className="w-16 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                value={valueToSearch}
                                onChange={e => setValueToSearch(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <label className="mb-1 font-medium text-gray-700">Nodos:</label>
                            <input
                                type="number"
                                min={1}
                                className="w-16 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                value={nodeCount}
                                onChange={e => setNodeCount(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <label className="mb-1 font-medium text-gray-700">V. máx:</label>
                            <input
                                type="number"
                                min={1}
                                className="w-16 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                value={maxValue}
                                onChange={e => setMaxValue(Number(e.target.value))}
                            />
                        </div>
                         <button className={buttonStyle} onClick={generateValues}>
                            Generar Valores <i className="fa-solid fa-rotate-right"></i>
                        </button>
                        <button className={buttonStyle + ' bg-green-600 hover:bg-green-700'} onClick={fetchTreeProcess}>
                            Nuevo Árbol
                        </button>
                        <button className={buttonStyle + ' bg-orange-600 hover:bg-orange-700'} onClick={addValues}>
                            Agregar Valores
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Árbol Original */}
                    <div className="p-4 bg-white shadow-lg rounded-xl">
                        <h4 className="mb-4 text-lg font-semibold text-center text-gray-800">Árbol Original</h4>
                        <div className="p-4 mb-6 border rounded-lg">
                            <Graphviz dot={jsonToDot((binaryTree2 && (binaryTree2 as TreeNode).value !== undefined) ? (binaryTree2 as TreeNode) : null)} options={{ width: '100%', height: '350px' }} />
                        </div>
                        
                        <div className="space-y-4">
                        {searchResult !== null && (
                        <div className={`mb-4 px-4 py-2 rounded-lg font-semibold text-center ${searchResult ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                            {searchResult ? `¡El valor ${valueToSearch} fue encontrado en el árbol original!` : `El valor ${valueToSearch} NO fue encontrado en el árbol original.`}
                        </div>
                    )}
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Inorder</h3>
                                <p className="text-gray-600">{inorderList.join(' -> ')}</p>
                            </div>
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Preorder</h3>
                                <p className="text-gray-600">{preorderList.join(' -> ')}</p>
                            </div>
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Postorder</h3>
                                <p className="text-gray-600">{postorderList.join(' -> ')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Árbol Balanceado */}
                    <div className="p-4 bg-white shadow-lg rounded-xl">
                        <h4 className="mb-4 text-lg font-semibold text-center text-gray-800">Árbol Balanceado</h4>
                        <div className="p-4 mb-6 border rounded-lg 0">
                            <Graphviz dot={jsonToDot((balancedBinaryTree && (balancedBinaryTree as TreeNode).value !== undefined) ? (balancedBinaryTree as TreeNode) : null)} options={{ width: '100%', height: '350px'}} />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Inorder</h3>
                                <p className="text-gray-600">{balancedInorderList.join(' -> ')}</p>
                            </div>
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Preorder</h3>
                                <p className="text-gray-600">{balancedPreorderList.join(' -> ')}</p>
                            </div>
                            <div className="p-2 bg-gray-200 rounded-md">
                                <h3 className="mb-2 font-medium text-gray-700 text-md">Postorder</h3>
                                <p className="text-gray-600">{balancedPostorderList.join(' -> ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
