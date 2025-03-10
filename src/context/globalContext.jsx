import {createContext, useState} from "react"

//crearmos el contexto
export const ContextGlobal = createContext()

//crear provider
export function GlobalProvider({children}) {
    const [productGlobal, setProductGlobal] = useState({
        id:0
    })
    const [urlGlobal, setUrlGlobal] = useState(
         //"https://inventario.elwayardo.com"
         'http://localhost:3000'
    )
    const [closeWindow, setCloseWindow] = useState(false)
    
    return(
        <ContextGlobal.Provider value={{productGlobal, setProductGlobal, urlGlobal, setUrlGlobal,closeWindow, setCloseWindow}}>
            {children}
        </ContextGlobal.Provider>
    )
}