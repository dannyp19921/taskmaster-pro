import React, { useState } from 'react'; 

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('E-post: ', email); 
        console.log('Passord: ', password); 
        // Here we can send data to backend later on 
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Logg inn</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passord</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Logg inn 
                </button>
            </form>
        </div>
    );
};

export default LoginForm; 