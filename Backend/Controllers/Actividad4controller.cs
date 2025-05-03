using System.Text;
using System.Text.Json;
using BinaryTrees;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class Actividad4Controller : ControllerBase
{
    [HttpPost]
    public IActionResult Get(TreeRequest request)
    {
        int[] valueList = request.valueList ?? new int[] { 6, 4, 8, 2, 1, 5, 9 };
        int valueToSearch = request.valueToSearch != 0 ? request.valueToSearch : 5;
        StringBuilder output = new StringBuilder();
        List<int> inorderList = new List<int>();
        List<int> preorderList = new List<int>();
        List<int> postorderList = new List<int>();
        List<int> balancedInorderList = new List<int>();
        List<int> balancedPreorderList = new List<int>();
        List<int> balancedPostorderList = new List<int>();
        BinaryTree binaryTree = new BinaryTree(output);

        foreach (int valor in valueList)
            binaryTree.Insert(valor);

        TreeNode tree = binaryTree.Root;
        binaryTree.InorderArray(binaryTree.Root, inorderList);
        binaryTree.PreorderArray(binaryTree.Root, preorderList);
        binaryTree.PostorderArray(binaryTree.Root, postorderList);
        binaryTree.Balance(binaryTree.Root, output);
        TreeNode balancedTree = binaryTree.Root;
        binaryTree.InorderArray(binaryTree.Root, balancedInorderList);
        binaryTree.PreorderArray(binaryTree.Root, balancedPreorderList);
        binaryTree.PostorderArray(binaryTree.Root, balancedPostorderList);
        return Ok(
            new TreeResponse
            {
                originalList = valueList,
                balancedList = valueList,
                tree = tree,
                balancedTree = balancedTree,
                searchResult = binaryTree.Search(valueToSearch),
                inorderList = inorderList,
                preorderList = preorderList,
                postorderList = postorderList,
                balancedInorderList = balancedInorderList,
                balancedPreorderList = balancedPreorderList,
                balancedPostorderList = balancedPostorderList,
            }
        );
    }
}

public class TreeRequest
{
    public int[] valueList { get; set; } = new int[0];
    public int valueToSearch { get; set; }
}

public class TreeResponse
{
    // public string output { get; set; }
    public int[] originalList { get; set; } = new int[0];
    public int[] balancedList { get; set; } = new int[0];

    public List<int> inorderList { get; set; } = new List<int>();
    public List<int> preorderList { get; set; } = new List<int>();
    public List<int> postorderList { get; set; } = new List<int>();
    public List<int> balancedInorderList { get; set; } = new List<int>();
    public List<int> balancedPreorderList { get; set; } = new List<int>();
    public List<int> balancedPostorderList { get; set; } = new List<int>();
    public TreeNode tree { get; set; } = new TreeNode(0, new StringBuilder());
    public TreeNode balancedTree { get; set; } = new TreeNode(0, new StringBuilder());
    public bool searchResult { get; set; }
}
