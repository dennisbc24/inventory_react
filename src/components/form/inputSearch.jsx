import axios from "axios";
import React, { useEffect, useState } from "react";
import './inputSearch.css'

export function InputSearch() {
    return(
<input type="text" id='inputSearch'/>
    )  
}

export function InputSimple({titulo,tipo,func, valor, callToAction='', nombre}) {
    return(
        <div className='inputSimple'>
            <h3>{titulo}</h3>
        <input type={tipo} onChange={func} value={valor} name={nombre} className='only_input' placeholder={callToAction}/>
        </div>
       
    )  
}

export function SelectSimple({children,titulo,func}) {
    return(
        <div className='selectSimple'> 
        <h3>{titulo}</h3>
        <select name="listSelect" onChange={func} className='only_select'>
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

export const SearchInput = ({urlApi, funcSet, minWitdh='200px', place='Buscar'}) => {
    const [data, setData] = useState()
    const [suggestions, setSuggestions] = useState([])
    const [query, setQuery] = useState('')
  
    
    function selectLi({target: {textContent}}) {
      data.forEach(element => {
        if (element.name === textContent) {
          funcSet(element)
          setSuggestions([])  
          setQuery('') 
       }
      })
      
    }
  
  async function compare(query){
    const filteredNames = await data.filter(
      (ele) =>
      ele.name.toLowerCase().includes(query.toLowerCase()) && query != ''
      )
      .map((product) => {
        // Resalta las letras coincidentes
        const index = product.name.toLowerCase().indexOf(query.toLowerCase());
        const start = product.name.substring(0, index);
        const match = product.name.substring(index, index + query.length);
        const end = product.name.substring(index + query.length);
        return (
          <span key={product.id_product}>
            {start}
            <strong>{match}</strong>
            {end}
          </span>
        );
      });
      setSuggestions(filteredNames)
  
  }
  
   async function configData (urlApi){
      const response = await axios.get(urlApi)
      setData(response.data)
    }
  
    useEffect(()=>{
    configData(urlApi)
    }, [])
   
  
    function searching({target : {value}}) {
        setQuery(value)
        compare(value)
        
    }
    return (
      <>
      
      <input className="big_input_search" type="text" onChange={searching} value={query} placeholder={place} style={{'minWitdh':`${minWitdh}`}}></input>
        <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
        <li key={index} onClick={selectLi}>
        {suggestion}
     </li>
    ))}
  </ul>
      
      
      </>
    
    )
  }