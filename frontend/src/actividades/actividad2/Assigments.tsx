import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';

// Definimos los tipos basados en la estructura del backend
interface Assignment {
    employee: number;
    project: number;
    efficiency: number;
}

interface AssignmentSolution {
    status: number; // Podría ser un enum si mapeas los valores exactos de ResultStatus
    optimalEfficiency: number;
    assignments: Assignment[];
    message?: string; // El mensaje es opcional
}

export const Assignments = () => {
    const navigate = useNavigate();
    const [efficiencyMatrix, setEfficiencyMatrix] = useState<number[][]>([
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
    const [maxAssignmentsPerEmployee] = useState<number>(1);
    const [maxEmployeesPerProject] = useState<number[]>([1, 2, 1, 2, 3]);
    const [solution, setSolution] = useState<AssignmentSolution | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);


    const generateRandomMatrix = (rows:number,cols:number) => {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(Math.floor(Math.random() * 1000));      
            }
            matrix.push(row);
        }
        return matrix;
    }
    

    // Tipamos las props de los componentes de renderizado
    interface RenderMatrixProps {
        matrix: number[][];
    }
    const RenderMatrix: React.FC<RenderMatrixProps> = ({ matrix }) => {
        const totalRows = matrix.length;
       const colsInTable = matrix[0].length? 'grid-cols-6' : 'grid-cols-5';
       let header: JSX.Element[] = [];
       if(totalRows>1){
        header = matrix[0].map((_cell:number,cellIndex:number)=><div key={cellIndex} className='self-center font-semibold'>P{cellIndex+1}</div>) 
        header.unshift(<div></div>)
       }

        
        return matrix.map((row: number[], index: number) => (
            
            <div className={'grid gap-1 text-lg text-center even:bg-gray-200 ' + colsInTable} key={index}>
                {totalRows>1 && index === 0 &&   header }
                {totalRows>1 && <div className='self-center font-semibold '>E{index}</div>}
                {row.map((cell: number, cellIndex: number) => (
                    <div key={cellIndex}>{cell}</div>
                ))}
            </div>
        ));
    };

    // interface RenderMatrix2Props {
    //     matrix: number[][];
    // }
    // const RenderMatrix2: React.FC<RenderMatrix2Props> = ({ matrix }) => {
    //     return (
    //         <div className="grid grid-cols-5 gap-1 text-lg text-center">
    //             <div className="col-span-5 mb-2 font-bold">Matriz de Eficiencia</div>
    //             {/* Encabezados de Proyectos */}
    //             <div className="font-semibold contents">
    //                 <div></div> {/* Espacio para Empleado */} 
    //                 {Array.from({ length: matrix[0]?.length ?? 0 }).map((_, j) => (
    //                     <div key={`header-${j}`}>Proyecto {j}</div>
    //                 ))}
    //             </div>
    //             {/* Filas de Empleados y Eficiencias */}
    //             {matrix.map((row: number[], i: number) => (
    //                  <React.Fragment key={`row-${i}`}>
    //                     <div className="self-center font-semibold">Empleado {i}</div>
    //                     {row.map((cell: number, j: number) => (
    //                         <div key={`cell-${i}-${j}`} className="p-1 border border-gray-300">{cell}</div>
    //                     ))}
    //                 </React.Fragment>
    //             ))}
    //         </div>
    //     );
    // };

    const getSolution = () => {
        console.log(efficiencyMatrix);
        console.log(maxEmployeesPerProject);
        console.log(maxAssignmentsPerEmployee);

        const formattedString = JSON.stringify(efficiencyMatrix).replace(/\],\[/g, "|").replace(/\[\[/g, "").replace(/\]\]/g, "");
        const solverData = {
            efficiencyMatrix: formattedString,
            maxEmployeesPerProject: maxEmployeesPerProject,
            maxAssignmentsPerEmployee: maxAssignmentsPerEmployee
        }   
        fetch('/api/actividad2',{method:'POST',body:JSON.stringify(solverData) ,headers: {'Content-Type': 'application/json'}})
            .then(response => response.json())
            .then(data => setSolution(data))
            .catch(error => console.error('Error:', error));
    }


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

        useEffect(() => {
        showSolution();
    }, [solution]);



    return (
        <div className='relative flex flex-col h-full bg-gray-50'>
              <button className="p-2 m-2 bg-white rounded-full" onClick={() => navigate(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button className='w-full p-2 mb-4 font-bold text-white bg-blue-500 rounded-lg' onClick={() =>{
                setSolution(null)
                setEfficiencyMatrix(generateRandomMatrix(8,5))
                setAssignments([])
                }}>Generar Matriz Aleatoria</button>
        <div className='flex-col flex-1 overflow-y-auto bg-gray-200'>
            {/* return button */}
          

            {/* title */}
            
            <div className='p-2 m-2 bg-white rounded-lg'>
                <h1 className="m-1 text-xl font-bold">Matriz de eficiencia</h1>
                <p className="m-1 text-sm">Enlista que tan eficiente es cada empleado en el tipo de proyecto que le corresponde</p>

                {/* matrix */}
                <div className="m-2">
                    <RenderMatrix matrix={efficiencyMatrix}/>
                </div>
               
                </div>

                {/* Mostrar la lista de asignaciones directamente */} 
                {solution && assignments.length > 0 && (
                    <div className='p-2 m-2 bg-white rounded-lg'> 
                        <h2 className="mb-2 text-xl font-bold">Asignaciones Óptimas</h2>
                         <ul className="pl-5 list-disc">
                            {assignments.map((assign, index) => (
                                <li key={index}>
                                    Empleado {assign.employee+1} {'->'} Proyecto {assign.project+1} (Eficiencia: {assign.efficiency})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Mostrar solution.message si existe */} 
                {solution && solution.message && (
                     <div className='p-2 m-2 text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg'>
                        <p><strong>Mensaje del Solver:</strong> {solution.message}</p>
                        {solution.status === 0 && solution.optimalEfficiency !== undefined && (
                             <p><strong>Eficiencia Total Óptima:</strong> {solution.optimalEfficiency.toFixed(2)}</p>
                        )}
                    </div>
                )}

            <div className='p-2 m-2 bg-white rounded-lg'>
                <h1 className="m-1 text-xl font-bold">Restricciones</h1>
                <p className="m-1 text-sm">Cada empleado puede ir a un maximo de {maxAssignmentsPerEmployee} proyecto(s)</p>
                <p className="m-1 text-sm">Los empleados máximos por proyecto son:</p>
                {/* Mostrar maxEmployeesPerProject como texto */} 
                <RenderMatrix matrix={[maxEmployeesPerProject]}/>
            </div>
                <button className='w-full p-2 mb-4 font-bold text-white bg-blue-500 rounded-lg' onClick={getSolution}>Calcular Solucion</button>
               
        </div>
        </div>
    );
}
