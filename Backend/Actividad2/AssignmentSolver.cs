using System;
using System.Text;
using System.Text.Json;
using Google.OrTools.LinearSolver;

public class AssignmentSolver
{
    public class Assignment
    {
        public int Employee { get; set; }
        public int Project { get; set; }
        public double Efficiency { get; set; }
    }

    // Estructura para devolver los resultados de forma organizada
    public class AssignmentSolution
    {
        public Solver.ResultStatus Status { get; set; }
        public double OptimalEfficiency { get; set; }
        public List<Assignment> Assignments { get; set; }
        public string? Message { get; set; }

        public AssignmentSolution()
        {
            Assignments = new List<Assignment>();
        }
    }

    public static AssignmentSolution SolveAssignmentProblem(
        double[,] efficiencyMatrix,
        int maxAssignmentsPerEmployee,
        int[] maxEmployeesPerProject
    )
    {
        AssignmentSolution result = new AssignmentSolution();
        int numEmployees = efficiencyMatrix.GetLength(0);
        int numProjects = efficiencyMatrix.GetLength(1);

        if (maxEmployeesPerProject.Length != numProjects)
        {
            result.Status = Solver.ResultStatus.NOT_SOLVED; // O un estado personalizado
            result.Message =
                "Error: La longitud del array maxEmployeesPerProject debe coincidir con el número de proyectos.";
            return result;
        }

        // 1. Inicialización del Solver (usando CBC para MIP)
        Solver solver = Solver.CreateSolver("CBC");
        if (solver == null)
        {
            result.Status = Solver.ResultStatus.NOT_SOLVED;
            result.Message = "Error: No se pudo crear el solver CBC.";
            return result;
        }

        // 3. Crear las Variables de Decisión Binarias x[i, j]
        Variable[,] variables = new Variable[numEmployees, numProjects];
        for (int i = 0; i < numEmployees; ++i)
        {
            for (int j = 0; j < numProjects; ++j)
            {
                variables[i, j] = solver.MakeBoolVar($"x_{i}_{j}");
            }
        }

        // 4. Definir las Restricciones Lineales
        // Restricción 1: Límite de asignaciones por empleado
        for (int i = 0; i < numEmployees; ++i)
        {
            LinearExpr assignmentsPerEmployeeExpr = new LinearExpr();
            for (int j = 0; j < numProjects; ++j)
            {
                assignmentsPerEmployeeExpr += variables[i, j];
            }
            solver.Add(assignmentsPerEmployeeExpr <= maxAssignmentsPerEmployee);
        }

        // Restricción 2: Límite de empleados por proyecto
        for (int j = 0; j < numProjects; ++j)
        {
            LinearExpr employeesPerProjectExpr = new LinearExpr();
            for (int i = 0; i < numEmployees; ++i)
            {
                employeesPerProjectExpr += variables[i, j];
            }
            solver.Add(employeesPerProjectExpr <= maxEmployeesPerProject[j]);
        }

        // 5. Definir la Función Objetivo (Maximizar Eficiencia Total)
        LinearExpr objective = new LinearExpr();
        for (int i = 0; i < numEmployees; ++i)
        {
            for (int j = 0; j < numProjects; ++j)
            {
                objective += efficiencyMatrix[i, j] * variables[i, j];
            }
        }
        solver.Maximize(objective);

        // 6. Resolver el Problema
        result.Status = solver.Solve();

        // 7. Evaluar y Procesar Resultados
        if (result.Status == Solver.ResultStatus.OPTIMAL)
        {
            result.OptimalEfficiency = solver.Objective().Value();
            result.Message =
                $"Solución Óptima Encontrada. Eficiencia Total Máxima = {result.OptimalEfficiency}";

            for (int i = 0; i < numEmployees; ++i)
            {
                for (int j = 0; j < numProjects; ++j)
                {
                    // Usar una tolerancia pequeña al comparar con 1.0
                    if (variables[i, j].SolutionValue() > 0.9)
                    {
                        result.Assignments.Add(
                            new Assignment
                            {
                                Employee = i,
                                Project = j,
                                Efficiency = efficiencyMatrix[i, j],
                            }
                        );
                    }
                }
            }
        }
        else if (result.Status == Solver.ResultStatus.FEASIBLE)
        {
            result.Message = "Se encontró una solución factible, pero no necesariamente óptima.";
            // Opcionalmente, también podrías extraer la solución factible aquí
        }
        else if (result.Status == Solver.ResultStatus.INFEASIBLE)
        {
            result.Message =
                "El problema es infactible (no hay asignación posible que cumpla las restricciones).";
        }
        else if (result.Status == Solver.ResultStatus.UNBOUNDED)
        {
            result.Message = "El problema es no acotado.";
        }
        else
        {
            result.Message = $"El solver terminó con estado: {result.Status}";
        }

        return result;
    }

    // Método de ejemplo para probar la clase
    public static AssignmentSolution RunSolver(
        double[,] efficiencyMatrix,
        int maxAssignmentsPerEmployee,
        int[] maxEmployeesPerProject
    )
    {
        // --- Datos de Ejemplo ---
        // Eficiencias: 8 empleados, 5 proyectos

        // --- Resolver ---
        AssignmentSolution solution = SolveAssignmentProblem(
            efficiencyMatrix,
            maxAssignmentsPerEmployee,
            maxEmployeesPerProject
        );
        // --- Mostrar Resultados ---
        StringBuilder solutionResponse = new StringBuilder();
        solutionResponse.AppendLine(solution.Message);
        if (solution.Status == Solver.ResultStatus.OPTIMAL)
        {
            solutionResponse.AppendLine("Asignaciones:");
            foreach (var assignment in solution.Assignments)
            {
                solutionResponse.AppendLine(
                    $"  Empleado {assignment.Employee} -> Proyecto {assignment.Project} (Eficiencia: {assignment.Efficiency})"
                );
            }
        }
        Console.WriteLine(solutionResponse);

        return solution;
    }
}
