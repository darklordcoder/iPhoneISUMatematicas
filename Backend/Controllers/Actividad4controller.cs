using System.Net;
using System.Text;
using System.Text.Json;
using BinaryTrees;
using Microsoft.AspNetCore.Mvc;

// Controlador para la actividad 4 que maneja operaciones con árboles binarios
[ApiController]
[Route("api/[controller]")]
public class Actividad4Controller : ControllerBase
{
    // Método que recibe una solicitud POST para procesar el árbol binario
    [HttpPost]
    public Object Get(TreeRequest request)
    {
        // Obtiene la lista de valores o usa una por defecto
        int[] valueList = request.valueList ?? new int[] { 6, 4, 8, 2, 1, 5, 9 };
        // Obtiene el valor a buscar o usa uno por defecto
        int valueToSearch = request.valueToSearch != 0 ? request.valueToSearch : 5;
        StringBuilder output = new StringBuilder();
        // Listas para almacenar los recorridos
        List<int> inorderList = new List<int>();
        List<int> preorderList = new List<int>();
        List<int> postorderList = new List<int>();
        List<int> balancedInorderList = new List<int>();
        List<int> balancedPreorderList = new List<int>();
        List<int> balancedPostorderList = new List<int>();
        // Crea el árbol binario
        BinaryTree binaryTree = new BinaryTree();

        // Construye el árbol con los valores dados
        binaryTree.BuildTree(valueList);

        // Obtiene la raíz del árbol
        TreeNode tree = binaryTree.Root;
        // Realiza los recorridos en el árbol original
        binaryTree.InOrder(binaryTree.Root, inorderList);
        binaryTree.Preorder(binaryTree.Root, preorderList);
        binaryTree.Postorder(binaryTree.Root, postorderList);
        // Balancea el árbol
        binaryTree.Balance(binaryTree.Root, output);
        // Obtiene la raíz del árbol balanceado
        TreeNode balancedTree = binaryTree.Root;
        // Realiza los recorridos en el árbol balanceado
        binaryTree.InOrder(binaryTree.Root, balancedInorderList);
        binaryTree.Preorder(binaryTree.Root, balancedPreorderList);
        binaryTree.Postorder(binaryTree.Root, balancedPostorderList);

        // Retorna la respuesta con los datos del árbol y los recorridos
        return Ok(
            new
            {
                statusCode = HttpStatusCode.OK,
                message = "OK",
                data = new
                {
                    originalList = valueList, // Lista original de valores
                    balancedList = valueList, // Lista usada para balancear (puede ajustarse si se requiere la lista balanceada)
                    tree = tree, // Árbol original
                    balancedTree = balancedTree, // Árbol balanceado
                    searchResult = binaryTree.Search(valueToSearch), // Resultado de la búsqueda
                    inorderList = inorderList, // Recorrido inorden original
                    preorderList = preorderList, // Recorrido preorden original
                    postorderList = postorderList, // Recorrido postorden original
                    balancedInorderList = balancedInorderList, // Recorrido inorden balanceado
                    balancedPreorderList = balancedPreorderList, // Recorrido preorden balanceado
                    balancedPostorderList = balancedPostorderList, // Recorrido postorden balanceado
                },
            }
        );
    }
}

// Clase para recibir la solicitud con la lista de valores y el valor a buscar
public class TreeRequest
{
    public int[] valueList { get; set; } = new int[0]; // Lista de valores para el árbol
    public int valueToSearch { get; set; } // Valor a buscar en el árbol
}
