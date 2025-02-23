import { Navigate, Outlet } from "react-router-dom";
import { MainMenu } from "./menuDespelgable.jsx";
import { useContext, useEffect } from "react";
import { ContextUser } from "../context/userContext.jsx";

export const ProtectedRoute = ({ isAllow, allowedRoles, user, children, redirectTo = "/" }) => {
    const { setUsuario } = useContext(ContextUser);

    useEffect(() => {     
        if (user?.user) {
            setUsuario(user.user);
        }
    }, [user, setUsuario]); // Se ejecuta cuando cambia `user`

    // Autenticar usuario
    if (!isAllow) {
        return <Navigate to={redirectTo} />;
    }

    // Si se pasan roles permitidos y el rol del usuario no está en la lista, redirigir
    if (allowedRoles && !allowedRoles.includes(user.user?.role)) {
        return <Navigate to={redirectTo} />;
    }

    return children ? children : (
        <>
            <MainMenu />
            <Outlet />
        </>
    );
};
