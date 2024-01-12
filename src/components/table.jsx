
import React, { useState, useEffect } from "react";

import axios from "axios";
const url = 'http://localhost:3000/api/v1/ventas/salesByDate?date=2024-01-11'

async function  Head  () {
    const [ventas, setVentas] = useState([]);
    const [propiedades, setEjemplo] = useState([]);


    useEffect(async ()=>{
        try {
            const response = await axios.get(url);
            setVentas(response.data)
      
            const algo = (Object.keys(ventas[0]))
            console.log(algo);
          } catch (error) {
            console.error("Error al obtener todos los datos:", error);
          }
    },[])

    

  
   
    return(
        <th>{propiedades}</th>
    )
        
    
}


export function TableGet() {
    


        return(
            <table>
    <thead>
      <tr>
            
        <Head/>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>dato 1</td>
        <td>dato 2</td>
        <td>dato 1</td>
        <td>dato 2</td>
        <td>dato 1</td>
        <td>dato 2</td>
        <td>dato 1</td>
        <td>dato 2</td>
        <td>dato 1</td>
        <td>dato 2</td>
      </tr>
    </tbody>
  </table>
        )}