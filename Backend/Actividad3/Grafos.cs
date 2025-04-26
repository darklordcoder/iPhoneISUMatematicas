class Grafo
{
    private int[,] adyacenceMatrix;
    private int vertices;

    public Grafo(int vertices)
    {
        this.vertices = vertices;
        adyacenceMatrix = new int[vertices, vertices];
    }

    public void AgregarArista(int origin, int destiny, int weigth)
    {
        adyacenceMatrix[origin, destiny] = weigth;
    }

    public void MostrarGrafo()
    {
        for (int i = 0; i < vertices; i++)
        {
            for (int j = 0; j < vertices; j++)
            {
                Console.Write(adyacenceMatrix[i, j] + " ");
            }
            Console.WriteLine();
        }
    }

    public void Dijkstra(int origin)
    {
        int[] distance = new int[vertices];
        bool[] visited = new bool[vertices];

        for (int i = 0; i < vertices; i++)
        {
            distance[i] = int.MaxValue;
            visited[i] = false;
        }

        distance[origin] = 0;

        for (int i = 0; i < vertices - 1; i++)
        {
            int u = Minimo(distance, visited);
            visited[u] = true;

            for (int v = 0; v < vertices; v++)
            {
                if (
                    !visited[v]
                    && adyacenceMatrix[u, v] != 0
                    && distance[u] != int.MaxValue
                    && distance[u] + adyacenceMatrix[u, v] < distance[v]
                )
                {
                    distance[v] = distance[u] + adyacenceMatrix[u, v];
                }
            }
        }

        Console.WriteLine("Distancia mínima desde el vértice " + origin + ":");
        for (int i = 0; i < vertices; i++)
        {
            Console.WriteLine("Vértice " + i + ": " + distance[i]);
        }
    }

    private int Minimo(int[] distance, bool[] visited)
    {
        int min = int.MaxValue;
        int minIndex = -1;

        for (int v = 0; v < vertices; v++)
        {
            if (!visited[v] && distance[v] <= min)
            {
                min = distance[v];
                minIndex = v;
            }
        }

        return minIndex;
    }
}
