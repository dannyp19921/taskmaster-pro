// frontend/src/components/Dashboard.tsx 
import React, { useState } from 'react'; 
import type { Task } from '../types/Task'; 
import TaskItem from './TaskItem';

type Props = {
    onLogout: () => void; 
}

const Dashboard = ({ onLogout }: Props) => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: 'Handle mat', 
            description: 'Kjøp melk, brød og ost', 
            dueDate: '2025-06-20', 
            completed: false,
        },
        {
            id: 2, 
            title: 'Levere oppgave', 
            description: 'Oblig 2 i INF101 må leveres', 
            dueDate: '2025-06-22', 
            completed: true, 
        }
    ]);

    const toggleComplete = (id: number) => {
        setTasks(prev =>
            prev.map(task =>
                task.id == id ? { ...task, completed: !task.completed } : task 
            )
        );
    };

    const deleteTask = (id: number) => {
        setTasks(prev => prev.filter(task => task.id !== id)); 
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-700">📝 Oppgaver</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem('token'); 
                        onLogout(); 
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Logg ut
                </button>
            </div>
        
            <ul className="space-y-4">
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleComplete}
                        onDelete={deleteTask}
                    />
                ))}
            </ul>
      </div>
    );
};

export default Dashboard; 

// Test 

/* KLADD: 

<li
                        key={task.id}
                        className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
                    >
                        <div>
                            <h2 className={`text-lg font-semibold ${task.completed ? `line-through text-gray-500` : ''}`}>
                                {task.title}
                            </h2>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Frist: {task.dueDate}</p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => toggleComplete(task.id)}
                                className={`px-3 py-1 rounded text-sm ${
                                    task.completed
                                        ? 'bg-gray-300 text-gray-700'
                                        : 'bg-green-500 text-white' 
                                }`}
                            >
                                {task.completed ? 'Angre' : 'Fullfør'}
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Slett 
                            </button>
                        </div>
                    </li>





const Dashboard = ({ onLogout }: Props) => {
    const [tasks, setTasks] = useState<Task[]>([

    ])


    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-100">
            <h1 className="text-3xl font-bold text-green-800 mb-6">
                Velkommen til Dashboard!
            </h1>
            <button
                onClick={() => {
                    localStorage.removeItem('token'); 
                    onLogout(); // notify App 
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
                Logg ut 
            </button>
        </div>      
    );
};

export default Dashboard;



*/ 