import { Graphviz } from "graphviz-react";
import { data } from "./data";
import { useState } from "react";

export const Arboles = () => {
    const nodeCount = 20;
    const maxValue = 50;
    const [grafo, setGrafo] = useState({});
    const [grafo2, setGrafo2] = useState({});
    const [inorderList, setInorderList] = useState([]);
    const [preorderList, setPreorderList] = useState([]);
    const [postorderList, setPostorderList] = useState([]);
    const [balancerInorderList, setBalancerInorderList  ] = useState([]);
    const [balancerPreorderList, setBalancerPreorderList] = useState([]);
    const [balancerPostorderList, setBalancerPostorderList] = useState([]);

    const [valueToSearch, setValueToSearch] = useState(40);
    const [valueList, setValueList] = useState([]);
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


    function jsonToDot(tree) {
        let dot = 'graph G {\n';
        function traverse(node) {
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

    const buttonStyle = 'p-3 m-2 text-white bg-blue-800 rounded-xl hover:bg-blue-900';

    return (
        <div>
            <h1>Arboles</h1>
            <button className={buttonStyle} onClick={generateValues}>Generar Valores</button>
            <button className={buttonStyle} onClick={fetchData}>Generar Arboles</button>
            <input value={valueList} />
            {valueList.join(', ')}
            <div className="flex flex-row"> 
                
                <div> <div className="flex flex-col">
                <Graphviz dot={jsonToDot(grafo2)} options={{ width: '600px', height: '600px' }} />
                <div className="flex flex-col">
                    <h1>Inorder</h1>
                    {inorderList.join(', ')}
                </div>
                <div className="flex flex-col">
                    <h1>Preorder</h1>
                    {preorderList.join(', ')}
                </div>
                <div className="flex flex-col">
                    <h1>Postorder</h1>
                    {postorderList.join(', ')}
                </div>

            </div></div>
            <div> <div className="flex flex-col">
                <Graphviz dot={jsonToDot(grafo)} options={{ width: '600px', height: '600px' }} />
                <div className="flex flex-col">
                    <h1>Inorder</h1>
                    {balancerInorderList.join(', ')}
                </div>
                <div className="flex flex-col">
                    <h1>Preorder</h1>
                    {balancerPreorderList.join(', ')}
                </div>
                <div className="flex flex-col">
                    <h1>Postorder</h1>
                    {balancerPostorderList.join(', ')}
                </div>
            </div>
            </div>      
            </div>
        </div>
    );
};
