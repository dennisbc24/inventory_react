import { Navigate, Outlet } from "react-router-dom"
import {MainMenu} from './menuDespelgable.jsx'

export const ProtectedRoute = ({isAllow, children, redirectTo="/"}) => {
    if(!isAllow){
        return <Navigate to={redirectTo}/>
    }
    return children ? children : 
    <>
    <MainMenu></MainMenu>
    <Outlet/>
    </>
    
}