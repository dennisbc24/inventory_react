
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

const TableTd2 =  (Adata) =>{ 
const {dato} = Adata

  const data = Object.values(dato)
    return(   
  <>{data.map((ele)=>{
    return(<td key={crypto.randomUUID()}>{ele}</td>)})
      }
  </>)
}

const TableTr =  ({urlApi}) =>{
  const [fill, setFill] = useState([])
  useEffect(()=>{
    axios.get(urlApi)
    .then(function (response) {
      const data3 = response.data
      
      setFill(data3)
      
    })
      
    .catch(function (e) { console.log(e)})
  },[])
  
return(
  <>
  {
    fill.map((ele)=>{

      
      return(
        <tr key={crypto.randomUUID()}>
        <TableTd2 dato={ele}/>
      </tr>
      )
    })
  }
  </>
)

}

export  function TableGet({url}) {
  

    return(
      <div className="result">
 <table className="infoTable">
        <thead>
          <tr>
              {<TableTh urlApi={url}/> }      

          </tr>
        </thead>
        <tbody>
          <TableTr urlApi={url} />
      
    </tbody>
  </table>
      </div>
 
        )}