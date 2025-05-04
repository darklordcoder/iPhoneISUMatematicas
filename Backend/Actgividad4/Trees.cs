using System.Text;

namespace BinaryTrees
{
    public class TreeNode
    {
        public int Value { get; set; }
        public TreeNode? left { get; set; }
        public TreeNode? right { get; set; }

        public TreeNode(int value)
        {
            Value = value;
            left = null;
            right = null;
        }
    }

    public class BinaryTree
    {
        public TreeNode? Root { get; set; }

        public BinaryTree()
        {
            Root = null;
        }

        private void Insert(int value)
        {
            Root = InsertNode(Root, value);
        }

        private TreeNode? InsertNode(TreeNode? node, int value)
        {
            if (node == null)
                return new TreeNode(value);
            if (value < node.Value)
                node.left = InsertNode(node.left, value);
            else if (value > node.Value)
                node.right = InsertNode(node.right, value);
            return node;
        }

        //contruir arbol desde un array
        public void BuildTree(int[] values)
        {
            foreach (int value in values)
                Insert(value);
        }

        public bool Search(int value)
        {
            return SearchNode(Root, value);
        }

        private bool SearchNode(TreeNode? node, int value)
        {
            if (node == null)
                return false;
            if (value == node.Value)
                return true;
            if (value < node.Value)
                return SearchNode(node.left, value);
            else
                return SearchNode(node.right, value);
        }

        public void InorderArray(TreeNode? node, List<int> values)
        {
            if (node != null)
            {
                InorderArray(node.left, values);
                values.Add(node.Value);
                InorderArray(node.right, values);
            }
        }

        public void PreorderArray(TreeNode? node, List<int> values)
        {
            if (node != null)
            {
                values.Add(node.Value);
                PreorderArray(node.left, values);
                PreorderArray(node.right, values);
            }
        }

        public void PostorderArray(TreeNode? node, List<int> values)
        {
            if (node != null)
            {
                PostorderArray(node.left, values);
                PostorderArray(node.right, values);
                values.Add(node.Value);
            }
        }

        private TreeNode? BuildBalancedTree(List<int> values, int start, int end)
        {
            if (start > end)
                return null;
            int mid = (start + end) / 2;
            TreeNode node = new TreeNode(values[mid]);
            node.left = BuildBalancedTree(values, start, mid - 1);
            node.right = BuildBalancedTree(values, mid + 1, end);
            return node;
        }

        public void Balance(TreeNode node, StringBuilder output)
        {
            List<int> values = new List<int>();
            InorderArray(node, values);
            Root = BuildBalancedTree(values, 0, values.Count - 1);
        }
    }
}
