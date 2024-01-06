import React from 'react'

import './inputSearch.css'

export function InputSearch() {
    return(
<input type="text" id='inputSearch'/>
    )  
}

export function InputSimple({titulo,tipo,func}) {
    return(
        <div className='inputSimple'>
            <h3>{titulo}</h3>
        <input type={tipo} onChange={func}/>
        </div>
       
    )  
}

export function SelectSimple({children,titulo}) {
    return(
        <div className='selectSimple'> 
        <h3>{titulo}</h3>
        <select name="listSelect">
            
            {children}
        </select>
        </div>
        
    )  
}

export function ParrafoInput({titulo, parrafo}) {
    return(
        <div className='parrafoForm'>
        <h3>{titulo}</h3>
        <p>{parrafo}</p>
        </div>
        
    )  
}
