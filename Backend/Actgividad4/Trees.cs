using System.Text;

namespace BinaryTrees
{
    // Clase que representa un nodo del árbol binario
    public class TreeNode
    {
        // Valor almacenado en el nodo
        public int Value { get; set; }

        // Referencia al hijo izquierdo
        public TreeNode? left { get; set; }

        // Referencia al hijo derecho
        public TreeNode? right { get; set; }

        // Constructor que inicializa el nodo con un valor
        public TreeNode(int value)
        {
            Value = value;
            left = null;
            right = null;
        }
    }

    // Clase que representa el árbol binario
    public class BinaryTree
    {
        // Raíz del árbol
        public TreeNode? Root { get; set; }

        // Constructor que inicializa el árbol vacío
        public BinaryTree()
        {
            Root = null;
        }

        // Método privado para insertar un valor en el árbol
        private void Insert(int value)
        {
            Root = InsertNode(Root, value);
        }

        // Método recursivo para insertar un nodo en el árbol
        private TreeNode? InsertNode(TreeNode? node, int value)
        {
            // Si el nodo es nulo, crea uno nuevo
            if (node == null)
                return new TreeNode(value);
            // Inserta en el subárbol izquierdo
            if (value < node.Value)
                node.left = InsertNode(node.left, value);
            // Inserta en el subárbol derecho
            else if (value > node.Value)
                node.right = InsertNode(node.right, value);
            return node;
        }

        // Construir el árbol a partir de un arreglo de valores
        public void BuildTree(int[] values)
        {
            foreach (int value in values)
                Insert(value); // Inserta cada valor en el árbol
        }

        // Buscar un valor en el árbol
        public bool Search(int value)
        {
            return SearchNode(Root, value);
        }

        // Método recursivo para buscar un valor en el árbol
        private bool SearchNode(TreeNode? node, int value)
        {
            // No se encontró el valor
            if (node == null)
                return false;
            // Valor encontrado
            if (value == node.Value)
                return true;
            // Buscar en el subárbol izquierdo
            if (value < node.Value)
                return SearchNode(node.left, value);
            // Buscar en el subárbol derecho
            else
                return SearchNode(node.right, value);
        }

        // Recorrido inorden: almacena los valores en una lista
        public void InOrder(TreeNode? node, List<int> values)
        {
            if (node != null)
            {
                // Visita el subárbol izquierdo
                InOrder(node.left, values);
                // Agrega el valor del nodo
                values.Add(node.Value);
                // Visita el subárbol derecho
                InOrder(node.right, values);
            }
        }

        // Recorrido preorden: almacena los valores en una lista
        public void Preorder(TreeNode? node, List<int> values)
        {
            if (node != null)
            {
                // Agrega el valor del nodo
                values.Add(node.Value);
                // Visita el subárbol izquierdo
                Preorder(node.left, values);
                // Visita el subárbol derecho
                Preorder(node.right, values);
            }
        }

        // Recorrido postorden: almacena los valores en una lista
        public void Postorder(TreeNode? node, List<int> values)
        {
            if (node != null)
            {
                // Visita el subárbol izquierdo
                Postorder(node.left, values);
                // Visita el subárbol derecho
                Postorder(node.right, values);
                // Agrega el valor del nodo
                values.Add(node.Value);
            }
        }

        // Construye un árbol balanceado a partir de una lista ordenada de valores
        private TreeNode? BuildBalancedTree(List<int> values, int start, int end)
        {
            // Caso base: sublista vacía
            if (start > end)
                return null;
            // Encuentra el punto medio
            int mid = (start + end) / 2;
            // Crea el nodo raíz del subárbol
            TreeNode node = new TreeNode(values[mid]);
            // Construye el subárbol izquierdo
            node.left = BuildBalancedTree(values, start, mid - 1);
            // Construye el subárbol derecho
            node.right = BuildBalancedTree(values, mid + 1, end);
            return node;
        }

        // Balancea el árbol usando el recorrido inorden
        public void Balance(TreeNode node, StringBuilder output)
        {
            List<int> values = new List<int>();
            // Obtiene los valores en orden
            InOrder(node, values);
            // Reconstruye el árbol balanceado
            Root = BuildBalancedTree(values, 0, values.Count - 1);
        }

        // Agregar nuevos valores al árbol
        public void AddValues(int[] values)
        {
            foreach (int value in values)
                Insert(value);
        }
    }
}
