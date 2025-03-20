import {createContext, useState} from "react"
import { IS_DEVELOPMENT } from "../components/config.js";
//crearmos el contexto
export const ContextGlobal = createContext()

const apiUrl = import.meta.env.VITE_API_URL; // variable de entorno



//crear provider
export function GlobalProvider({children}) {
    const [productGlobal, setProductGlobal] = useState({
        id:0
    })
    const [urlGlobal, setUrlGlobal] = useState(
        IS_DEVELOPMENT ? "http://localhost:3000" : "https://inventario.elwayardo.com"
         //"https://inventario.elwayardo.com"
         //'http://localhost:3000'
    )
    const [closeWindow, setCloseWindow] = useState(false)
    
    return(
        <ContextGlobal.Provider value={{productGlobal, setProductGlobal, urlGlobal, setUrlGlobal,closeWindow, setCloseWindow}}>
            {children}
        </ContextGlobal.Provider>
    )
}