using System.Net;
using System.Text;
using System.Text.Json;
using BinaryTrees;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class Actividad4Controller : ControllerBase
{
    [HttpPost]
    public Object Get(TreeRequest request)
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
        BinaryTree binaryTree = new BinaryTree();

        binaryTree.BuildTree(valueList);

        TreeNode tree = binaryTree.Root;
        binaryTree.InorderArray(binaryTree.Root, inorderList);
        binaryTree.PreorderArray(binaryTree.Root, preorderList);
        binaryTree.PostorderArray(binaryTree.Root, postorderList);
        binaryTree.Balance(binaryTree.Root, output);
        TreeNode balancedTree = binaryTree.Root;
        binaryTree.InorderArray(binaryTree.Root, balancedInorderList);
        binaryTree.PreorderArray(binaryTree.Root, balancedPreorderList);
        binaryTree.PostorderArray(binaryTree.Root, balancedPostorderList);

        //retorna treeResponse en data con codigo ok
        return Ok(
            new
            {
                statusCode = HttpStatusCode.OK,
                message = "OK",
                data = new
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
                },
            }
        );
    }
}

public class TreeRequest
{
    public int[] valueList { get; set; } = new int[0];
    public int valueToSearch { get; set; }
}
