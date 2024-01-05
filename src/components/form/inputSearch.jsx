import React from 'react'

/* import './index.css' */

export function InputSearch() {
    return(
<input type="text" id='inputSearch'/>
    )  
}

export function InputSimple({titulo,tipo}) {
    return(
        <>
        <p>{titulo}</p>
        <input type={tipo}/>
        </>
        
    )  
}

export function SelectSimple({children,titulo}) {
    return(
        <>
        <h3>{titulo}</h3>
        <select name="listSelect">
            
            {children}
        </select>
        </>
        
    )  
}

export function ParrafoInput({titulo, parrafo}) {
    return(
        <>
        <h3>{titulo}</h3>
        <p>{parrafo}</p>
        </>
        
    )  
}
