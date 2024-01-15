
import React, { useState, useEffect } from "react";
import axios from "axios";

const unaVenta = {id_sale: 18271, branch: 'nuevo', date: '2024-01-13T05:00:00.000Z', amount: 1, product: 'Ropero 2C YIWU 105x173 MARRON'}

const TableTh =  ({urlApi}) =>{

  const [llaves, setLlaves] = useState([])

  useEffect(()=>{
    axios.get(urlApi)
    .then(function (response) {
      const data3 = response.data
      setLlaves(Object.keys(data3[0]))
      
      
      
    })
      .catch(function (error) {
      // handle error
      console.log(error);
    })
  },[])
  
     
return(
  llaves.map((sell)=>{
  
  return(<th key={sell} >{sell}</th>)
}
    
  )
)
  
}


const TableTd =  () =>{
  const [fill, setFill] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:3000/api/v1/ventas')
    .then(function (response) {
      const data3 = response.data
      console.log(data3)
      setFill(Object.values(data3[0]))
      console.log(data3[0])
    })
      
    .catch(function (error) { console.log(error)})},
     [])
  
console.log(fill);
return( fill.map((sell)=>{return(<td key={crypto.randomUUID()} >{sell}</td>)}))
}


const TableTd2 =  (dato) =>{
  const [fill, setFill] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:3000/api/v1/ventas')
    .then(function (response) {
      const data3 = response.data
      console.log(dato);
      setFill(Object.values(data3[0]))
      console.log(fill)
    })
      
    .catch(function (error) { console.log(error)})},
     [])
  
console.log(fill);
return( fill.map((sell)=>{return(<td key={crypto.randomUUID()} >{sell}</td>)}))
}



export  function TableGet() {
  
    return(
  <table>
        <thead>
          <tr>
              {<TableTh urlApi='http://localhost:3000/api/v1/ventas'/> }      

          </tr>
        </thead>
        <tbody>
      <tr>
        <TableTd2 dato={unaVenta}/>
      </tr>
    </tbody>
  </table>
        )}