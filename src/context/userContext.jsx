import {createContext, useState} from "react"

//crearmos el contexto
export const ContextUser = createContext()

//crear provider
export function UserProvider({children}) {
    const [usuario, setUsuario] = useState({
        
        role: "viewer"
    })
    //console.log(usuario?.role);
    
    return(
        <ContextUser.Provider value={{usuario, setUsuario}}>
            {children}
        </ContextUser.Provider>
       

        
    )
}