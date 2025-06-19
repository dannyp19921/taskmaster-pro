// frontend/src/App.tsx 
import './index.css';
import React, { useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import PrivateRoutes from './components/PrivateRoutes';
import axios from './api/axios'; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isVerifying, setIsVerifying] = useState(true); 

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token'); 
      console.log('[verifyToken] Hentet token:', token);
      if (!token) {
        setIsLoggedIn(false); 
        setIsVerifying(false); 
        return; 
      }

      try {
        const response = await axios.get('/api/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); 

        if (response.status === 200) {
          console.log('[verifyToken] Token er gyldig, status:', response.status);
          setIsLoggedIn(true); 
        } else {
          console.warn('[verifyToken] Token ugyldig, status:', response.status);
          localStorage.removeItem('token'); 
          setIsLoggedIn(false); 
        }
      } catch (err) {
        console.error('[verifyToken] Feil under verifisering:', err);
        localStorage.removeItem('token'); 
        setIsLoggedIn(false); 
      } finally {
        console.log('[verifyToken] Ferdig med verifisering');
        setIsVerifying(false); // Make sure we always move on 
      }
    };

    verifyToken(); // Is called in useEffect 
  }, []);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid" />
      </div>
    );
  }

  /* if (isVerifying) {
    return <div className="p-6 text-center">Verifiserer...</div>; // Alternatively: A spinner. 
  } */

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginForm onLogin={() => setIsLoggedIn(true)} />} />

        {/* Protected route wrapper */}
        <Route element={<PrivateRoutes isAuthenticated={isLoggedIn} />}>
          <Route path="dashboard" element={<Dashboard onLogout={() => setIsLoggedIn(false)} />} />
          {/* More private routes can be added here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />  
      </Routes>
    </Router>
  );
};

export default App;
 
/* KLADD: 
<Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginForm onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <Dashboard onLogout={() => setIsLoggedIn(false)} />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} />}
        />
*/

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
