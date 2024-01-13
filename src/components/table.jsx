
import React, { useState, useEffect } from "react";
import axios from "axios";

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
      setFill(Object.values(data3[0]))
      
      
    })
      .catch(function (error) {
      // handle error
      console.log(error);
    })
  },[])
  console.log(fill);
  
return(
  
fill.map((sell)=>{
  
  return(<td key={sell} >{sell}</td>)
}
    
  )
)
  
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
        <TableTd/>
      </tr>
    </tbody>
  </table>
        )}