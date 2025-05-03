using System.Text;

namespace BinaryTrees
{
    public class TreeNode
    {
        public int Value { get; set; }
        public TreeNode? left { get; set; }
        public TreeNode? right { get; set; }
        private StringBuilder output { get; set; }

        public TreeNode(int value, StringBuilder output)
        {
            Value = value;
            left = null;
            right = null;
            this.output = output;
        }
    }

    public class BinaryTree
    {
        public TreeNode? Root { get; set; }
        public StringBuilder output { get; set; }

        public BinaryTree(StringBuilder output)
        {
            Root = null;
            this.output = output;
        }

        public void Insert(int value)
        {
            Root = InsertNode(Root, value);
        }

        private TreeNode InsertNode(TreeNode node, int value)
        {
            if (node == null)
                return new TreeNode(value, output);
            if (value < node.Value)
                node.left = InsertNode(node.left, value);
            else if (value > node.Value)
                node.right = InsertNode(node.right, value);
            return node;
        }

        public void Inorder()
        {
            output.AppendLine("Inorder:");
            Inorder(Root);
            output.AppendLine();
        }

        private void Inorder(TreeNode node)
        {
            if (node != null)
            {
                Inorder(node.left);
                output.Append(node.Value + " ");
                Inorder(node.right);
            }
        }

        public void Preorder()
        {
            output.AppendLine("Preorder:");
            Preorder(Root);
            output.AppendLine();
        }

        private void Preorder(TreeNode node)
        {
            if (node != null)
            {
                output.Append(node.Value + " ");
                Preorder(node.left);
                Preorder(node.right);
            }
        }

        public void Postorder()
        {
            output.AppendLine("Postorder:");
            Postorder(Root);
            output.AppendLine();
        }

        private void Postorder(TreeNode node)
        {
            if (node != null)
            {
                Postorder(node.left);
                Postorder(node.right);
                output.Append(node.Value + " ");
            }
        }

        public bool Search(int value)
        {
            return SearchNode(Root, value);
        }

        private bool SearchNode(TreeNode node, int value)
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

        public void InorderArray(TreeNode node, List<int> values)
        {
            if (node != null)
            {
                InorderArray(node.left, values);
                values.Add(node.Value);
                InorderArray(node.right, values);
            }
        }

        public void PreorderArray(TreeNode node, List<int> values)
        {
            if (node != null)
            {
                values.Add(node.Value);
                PreorderArray(node.left, values);
                PreorderArray(node.right, values);
            }
        }

        public void PostorderArray(TreeNode node, List<int> values)
        {
            if (node != null)
            {
                PostorderArray(node.left, values);
                PostorderArray(node.right, values);
                values.Add(node.Value);
            }
        }

        private TreeNode BuildBalancedTree(List<int> values, int start, int end)
        {
            if (start > end)
                return null;
            int mid = (start + end) / 2;
            TreeNode node = new TreeNode(values[mid], output);
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
