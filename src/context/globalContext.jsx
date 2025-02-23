import {createContext, useState} from "react"

//crearmos el contexto
export const ContextGlobal = createContext()

//crear provider
export function GlobalProvider({children}) {
    const [productGlobal, setProductGlobal] = useState({
        
        id:0
    })
    
    return(
        <ContextGlobal.Provider value={{productGlobal, setProductGlobal}}>
            {children}
        </ContextGlobal.Provider>
       

        
    )
}