using System.Net;
using System.Text;
using System.Text.Json;
using BinaryTrees;
using Microsoft.AspNetCore.Http;
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
        StringBuilder output = new StringBuilder();
        // Obtiene la lista de valores o usa una por defecto
        int[] valueList = request.valueList ?? new int[] { 6, 4, 8, 2, 1, 5, 9 };
        // Obtiene el valor a buscar o usa uno por defecto
        int valueToSearch = request.valueToSearch != 0 ? request.valueToSearch : 5;

        // Listas para almacenar los recorridos

        // Crea el árbol binario
        BinaryTree? binaryTree = new BinaryTree();

        // Construye el árbol con los valores dados
        binaryTree.BuildTree(valueList);

        // Realiza los recorridos en el árbol original
        TreeStructure treeStructure = GetTreeStructure(binaryTree, valueToSearch);

        //guardar arbol en session
        HttpContext.Session.SetString("treeStructure", JsonSerializer.Serialize(treeStructure));
        binaryTree.Balance(binaryTree.Root, output);
        // Obtiene la raíz del árbol balanceado
        TreeNode balancedTree = binaryTree.Root;
        // Realiza los recorridos en el árbol balanceado

        TreeStructure balancedTreeStructure = GetTreeStructure(binaryTree, valueToSearch);

        // Retorna la respuesta con los datos del árbol y los recorridos
        return Ok(
            new
            {
                statusCode = HttpStatusCode.OK,
                message = "OK",
                data = new
                {
                    treeStructure = treeStructure,
                    balancedTreeStructure = balancedTreeStructure,
                },
            }
        );
    }

    private TreeStructure GetTreeStructure(BinaryTree binaryTree, int valueToSearch)
    {
        StringBuilder output = new StringBuilder();
        List<int> inorderList = new List<int>();
        List<int> preorderList = new List<int>();
        List<int> postorderList = new List<int>();

        // Obtiene la raíz del árbol
        TreeNode? tree = binaryTree.Root;
        binaryTree.InOrder(binaryTree.Root, inorderList);
        binaryTree.Preorder(binaryTree.Root, preorderList);
        binaryTree.Postorder(binaryTree.Root, postorderList);
        TreeStructure treeStructure = new TreeStructure
        {
            tree = tree,
            inorderList = inorderList,
            preorderList = preorderList,
            postorderList = postorderList,
            searchResult = binaryTree.Search(valueToSearch),
        };
        return treeStructure;
    }

    //Recibir una nueva listga de valores a agregar al arbol
    [HttpPost("addValues")]
    public IActionResult AddValues([FromBody] AddValuesRequest request)
    {
        StringBuilder output = new StringBuilder();
        // Obtener el árbol actual de la sesión
        var treeStructure = HttpContext.Session.GetString("treeStructure");

        if (treeStructure == null)
        {
            return BadRequest("No se encontró un árbol en la sesión");
        }

        // Deserializar el árbol actual
        var treeStructureObject = JsonSerializer.Deserialize<TreeStructure>(treeStructure);

        // Agregar los nuevos valores al árbol
        BinaryTree binaryTree = new BinaryTree();
        binaryTree.Root = treeStructureObject?.tree;
        binaryTree.AddValues(request.valueList);
        TreeStructure updatedTreeStructure = GetTreeStructure(binaryTree, 0);

        // Serializar el árbol actualizado
        var memoryTree = JsonSerializer.Serialize(updatedTreeStructure);

        // Guardar el árbol actualizado en la sesión
        HttpContext.Session.SetString("treeStructure", memoryTree);

        binaryTree.Balance(binaryTree.Root, output);
        // Obtiene la raíz del árbol balanceado
        TreeNode balancedTree = binaryTree.Root;
        // Realiza los recorridos en el árbol balanceado

        TreeStructure balancedTreeStructure = GetTreeStructure(binaryTree, 0);

        return Ok(
            new
            {
                message = "Valores agregados al árbol correctamente",
                statusCode = HttpStatusCode.OK,
                data = new
                {
                    treeStructure = updatedTreeStructure,
                    balancedTreeStructure = balancedTreeStructure,
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

public class AddValuesRequest
{
    public int[] valueList { get; set; } = new int[0]; // Lista de valores para el árbol
}

//Clase para representar arbol, arbol balanceado, y recorridos en memoria
public class TreeStructure
{
    public TreeNode? tree { get; set; } // Árbol original
    public List<int>? inorderList { get; set; } // Recorrido inorden original
    public List<int>? preorderList { get; set; } // Recorrido preorden original
    public List<int>? postorderList { get; set; } // Recorrido postorden original
    public bool? searchResult { get; set; } // Resultado de la búsqueda
}
