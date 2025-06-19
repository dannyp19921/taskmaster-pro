// Dashboard.tsx 
import React from 'react'; 

type Props = {
    onLogout: () => void; 
}

const Dashboard = ({ onLogout }: Props) => {
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



{/* <div className="flex items-center justify-center h-screen bg-green-100">
            <h1 className="text-3xl font-bold text-green-800">Velkommen til Dashboard!</h1>
        </div> */}