// PrivateRoutes.tsx 
import { Navigate, Outlet } from 'react-router-dom'; 
import React from 'react'; 

type Props = {
    isAuthenticated: boolean; 
};

const PrivateRoutes = ({ isAuthenticated }: Props) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />; 
}

export default PrivateRoutes; 

/* type Props = {
    isAuthenticated: boolean; 
    children: JSX.Element; 
}; 

const PrivateRoute = ({ isAuthenticated, children }: Props) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }

    return children; 
}

export default PrivateRoute;  */