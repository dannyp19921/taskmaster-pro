// App.tsx 
import './index.css';
import React, { useEffect, useState } from 'react'; 
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import axios from 'axios';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        setIsLoggedIn(false); 
        return; 
      }

      try {
        const response = await axios.get('http://localhost:3000/api/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); 

        if (response.status === 200) {
          setIsLoggedIn(true); 
        } else {
          localStorage.removeItem('token'); 
          setIsLoggedIn(false); 
        }
      } catch (err) {
        localStorage.removeItem('token'); 
        setIsLoggedIn(false); 
      }
    };

    verifyToken(); // ✅ Kalles inne i useEffect
  }, []);

  return (
    <div>
      {isLoggedIn
        ? <Dashboard onLogout={() => setIsLoggedIn(false)} />
        : <LoginForm onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
};

export default App;
 


/* 
    const token = localStorage.getItem('token'); 
    if (!token) {
      setIsLoggedIn(false); 
      return; 
    }

    try {
      const response = await axios.get('http://localhost:3000/api/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 

      if (response.status === 200) {
        setIsLoggedIn(true); 
      } else {
        localStorage.removeItem('token'); 
        setIsLoggedIn(false); 
      }
    } catch (err) {
      localStorage.removeItem('token'); 
      setIsLoggedIn(false); 
    }; 

    verifyToken(); 
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token'); 
    setIsLoggedIn(!!token); // true if token exists 
  }, []);

  return (
    <div>
      {isLoggedIn
        ? <Dashboard onLogout={() => setIsLoggedIn(false)} />
        : <LoginForm onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
};

export default App;  */

/*
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/
