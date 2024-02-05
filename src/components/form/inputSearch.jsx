import React from 'react'

import './inputSearch.css'

export function InputSearch() {
    return(
<input type="text" id='inputSearch'/>
    )  
}

export function InputSimple({titulo,tipo,func, valor}) {
    return(
        <div className='inputSimple'>
            <h3>{titulo}</h3>
        <input type={tipo} onChange={func} value={valor}/>
        </div>
       
    )  
}

export function SelectSimple({children,titulo,func}) {
    return(
        <div className='selectSimple'> 
        <h3>{titulo}</h3>
        <select name="listSelect" onChange={func}>
            
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

export function ButtonSave({titulo,func }) {
    return(
       <button className='button_save' onClick={func}> 
            {titulo}
       </button>
        
    )  
}
