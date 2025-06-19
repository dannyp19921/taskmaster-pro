// frontend/src/components/TaskItem.tsx 

import React from 'react'; 
import type { Task } from '../types/Task'; 

type Props = {
    task: Task; 
    onToggle: (id: number) => void; 
    onDelete: (id: number) => void; 
}

const TaskItem = ({ task, onToggle, onDelete }: Props) => {
    return (
        <li
            className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
        >
            <div>
                <h2 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                </h2>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-500 mt-1">Frist: {task.dueDate}</p>
            </div>
            <div className="space-x-2">
                <button
                    onClick={() => onToggle(task.id)}
                    className={`px-3 py-1 rounded text-sm ${
                        task.completed
                            ? 'bg-gray-300 text-gray-700'
                            : 'bg-green-500 text-white' 
                    }`}
                >
                    {task.completed ? 'Angre' : 'Fullfør'}
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                    Slett 
                </button>
            </div>
        </li>
    ); 
};

export default TaskItem; 