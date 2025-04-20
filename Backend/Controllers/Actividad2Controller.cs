//Controlador para la actividad 2

using System;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/Actividad2")]
public class Actividad2Controller : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        double[,] efficiencyMatrix =
        {
            { 90, 76, 75, 70, 50 },
            { 35, 85, 55, 65, 45 },
            { 100, 95, 90, 85, 50 },
            { 50, 100, 95, 80, 60 },
            { 100, 20, 30, 40, 30 },
            { 10, 20, 30, 40, 50 },
            { 56, 45, 30, 20, 10 },
            { 99, 98, 97, 96, 95 },
            { 100, 100, 100, 100, 100 },
        };
        int numEmployees = efficiencyMatrix.GetLength(0);
        int numProjects = efficiencyMatrix.GetLength(1);

        // Restricciones
        int maxAssignmentsPerEmployee = 1; // Cada empleado solo puede ir a un proyecto
        int[] maxEmployeesPerProject = { 1, 2, 1, 2, 3 }; // Empleados maximos para cada proyecto

        var assignmentSolver = AssignmentSolver.RunSolver(
            efficiencyMatrix,
            maxAssignmentsPerEmployee,
            maxEmployeesPerProject
        );
        // var resultInJsonWithTabsAndLists = JsonSerializer.Serialize(
        //     assignmentSolver,
        //     new JsonSerializerOptions { WriteIndented = true, IncludeFields = true }
        // );
        // // Console.WriteLine(resultInJsonWithTabsAndLists);

        return Ok(assignmentSolver);
    }
}
