// LoginForm.tsx 
import axios from '../api/axios'; 
import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 

type Props = {
    onLogin: () => void; 
};

const LoginForm = ({ onLogin }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setMessage(''); 

        try {       // Success logic 
            const response = await axios.post('http://localhost:3000/api/login', {
                email, 
                password,
            }); 

            const token = response.data.token; 
            console.log('Token mottatt: ', token);
            localStorage.setItem('token', token);  
            setMessage('Innlogging vellykket!'); 
            onLogin(); // sets isLoggedIn 
            navigate('/dashboard'); 
            // We can save token in localStorage, e.g.: localStorage.setItem('token', token); 
        } catch (error: any) {      // Fail management 
            if (error.response) {
                setMessage(error.response.data.message || 'Innlogging feilet.');
            } else {
                setMessage('Noe gikk galt.'); 
            }
        }
    };

    /* const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('E-post: ', email); 
        console.log('Passord: ', password); 
        // Here we can send data to backend later on 
    }; */

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Logg inn</h2>

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

                <p
                    className={`mt-4 text-center text-sm ${
                        message.includes('vellykket') ? 'text-green-600' : 'text-red-600'
                    }`}
                    >
                    {message}
                </p>
            </form>
        </div>
    );
};

export default LoginForm; 

/* KLADD: 


                <p className="text-green-600 text-center">Dette skal være grønn tekst (test)</p>
                <p className="text-red-600 text-center">Dette skal være rød tekst (test)</p>

               
                <p
                    className={`mt-4 text-center text-sm ${
                        message.includes('vellykket') ? 'text-green-600' : 'text-red-600'
                    }`}
                    >
                    {message}
                </p>

*/