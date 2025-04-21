import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Assignments = () => {
    const navigate = useNavigate();
    const [efficiencyMatrix, setEfficiencyMatrix] = useState([
        [90, 76, 75, 70, 50],
        [35, 85, 55, 65, 45],
        [100, 95, 90, 85, 50],
        [50, 100, 95, 80, 60],
        [100, 20, 30, 40, 30],
        [10, 20, 30, 40, 50],
        [56, 45, 30, 20, 10],
        [99, 98, 97, 96, 95],
        [100, 100, 100, 100, 100],
    ]);
    const [maxAssignmentsPerEmployee, setMaxAssignmentsPerEmployee] = useState(1);
    const [maxEmployeesPerProject, setMaxEmployeesPerProject] = useState([[1, 2, 1, 2, 3]]);
    const [solution, setSolution] = useState(null);
    const [assignments, setAssignments] = useState(null);


    const RenderMatrix = ({matrix}) => {
        return matrix.map((row, index) => (
            <div className="grid grid-cols-5 gap-1 text-center text-lg even:bg-gray-200 " key={index}>{row.map((cell, index) => (
                <div key={index} className="p-1">{cell}</div>
            ))}</div>
        ))
    }

    const RenderMatrix2 = ({matrix}) => {
        console.log("Matrix",matrix);
        return ( 
            <div>
                <div className="grid grid-cols-3 gap-1 text-center even:bg-gray-200 font-bold "   >
                    <div>Empleado</div>
                    <div>Proyecto</div>
                    <div>Eficiencia</div>
                </div>
            {matrix.map((row, index) => (

            
            <div className="grid grid-cols-3 gap-1 py-1 text-center text-lg  even:bg-gray-200 " key={index}>
                <div>{row.employee+1}</div>
                <div>{row.project+1}</div>
                <div>{row.efficiency}</div>
            </div>
        ))}
        </div>      
    )
    }

    const getSolution = () => {
        console.log(efficiencyMatrix);
        console.log(maxEmployeesPerProject);
        console.log(maxAssignmentsPerEmployee);
        //fetch to backend
        const solverData = {
            efficiencyMatrix: efficiencyMatrix,
            maxEmployeesPerProject: maxEmployeesPerProject,
            maxAssignmentsPerEmployee: maxAssignmentsPerEmployee
        }   
        fetch('/api/actividad2',{method:'POST',body:JSON.stringify(solverData) })
            .then(response => response.json())
            .then(data => setSolution(data))
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        showSolution();
    }, [solution]);

    const showSolution = () => {
        console.log("TEST",solution);
        if(solution){
            if(solution.assignments
                && solution.assignments
                .length > 0){
                setAssignments(solution.assignments
                );
                console.log("TEST",solution.assignments
                );
            }
        }
    }


    return (
        <div className='relative flex flex-col h-full bg-gray-50'>
              <button className="m-2 p-2 bg-white rounded-full" onClick={() => navigate(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        <div className='flex-1 flex-col bg-gray-200 overflow-y-auto'>
            {/* return button */}
          

            {/* title */}
            
            <div className='bg-white rounded-lg m-2 p-2'>
                <h1 className="m-1 text-xl font-bold">Matriz de eficiencia</h1>
                <p className="m-1 text-sm">Enlista que tan eficiente es cada empleado en el tipo de proyecto que le corresponde</p>

                {/* matrix */}
                <div className="m-2">
                    <RenderMatrix matrix={efficiencyMatrix}/>
                </div>
               
                </div>

                {assignments &&<div className='m-2 bg-white rounded-lg p-2'> <RenderMatrix2 matrix={assignments}/></div>}  
            <div className='m-2 bg-white rounded-lg p-2'>
                <h1 className="m-1 text-xl font-bold">Restricciones</h1>
                <p className="m-1 text-sm">Cada empleado puede ir a un maximo de 1 proyecto</p>
                <p className="m-1 text-sm">los empleados se asignan segun la tabla de recursos</p>
                <RenderMatrix matrix={maxEmployeesPerProject}/>
            </div>
                <button className='p-2 bg-blue-500 w-full text-white  font-bold rounded-lg mb-4' onClick={getSolution}>Calcular Solucion</button>
        </div>
        </div>
    );
}
