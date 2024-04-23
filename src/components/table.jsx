
import { useState, useEffect } from "react";
import axios from "axios";
import "./table.css"

const TableTh =  ({urlApi, token}) =>{

  let config = {
    headers:{
      'Authorization': `Bearer ${token}`
    }
  }

  const [llaves, setLlaves] = useState([])

  useEffect(()=>{
    axios.get(urlApi, config)
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

const TableTr =  ({urlApi, token, modify}) =>{

  let config = {
    headers:{
      'Authorization': `Bearer ${token}`
    }
  }
  const [fill, setFill] = useState([])
  useEffect(()=>{
    axios.get(urlApi, config)
    .then(function (response) {
      const data3 = response.data
      setFill(data3)
      
    })
      
    .catch(function (e) { console.log(e)})
  },[])


  useEffect(()=>{
    sumas()
  }, [fill])

  const [sum, setSum] = useState(null)

  function sumas(){
    let suma = []
    let suma2 = []
    fill.map((el)=>{

    const campo2 = 'p_total'
    const campo = 'ganancia'
    if (campo in el) {
      const itemRevenue = el[campo]
      suma.push(itemRevenue)
      
    }
    if (campo2 in el) {
      const itemRevenue2 = el[campo2]
      suma2.push(itemRevenue2)
      
    }
    
    })
    let ganancia = suma.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    let vTotal = suma2.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    modify({v_total:vTotal,suma:ganancia})
   
  }

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



export  function TableGet({url, minWitdh='1051px', token}) {
  const [sumar, setSumar] = useState({v_total:0,suma:0})
      return(
      <div className="result">
 <table className="infoTable" style={{'minWidth':`${minWitdh}`}}>
        <thead className="table_header">
          <tr>
              {<TableTh urlApi={url} token={token}/> }      

          </tr>
        </thead>
        <tbody className="table_body">
          <TableTr urlApi={url} token={token} modify={setSumar} />
      
    </tbody>
    {<>{sumar.suma > 0 ? <tfoot>
          <tr>
            <td>Venta Total</td>
            <td>S/.{sumar.v_total}</td>
            <td>Ganancia</td>
            <td>S/.{sumar.suma}</td>
          </tr>
        </tfoot> : <></>
    }</>}
        
  </table>
      </div>
 
        )}


const TableThTest =  ({respJson}) =>{
  const [llaves, setLlaves] = useState([])

  useEffect(()=>{
      const data3 = respJson
      setLlaves(Object.keys(data3[0]))
      },[])

return(
  llaves.map((sell)=>{
  return(<th key={sell} >{sell}</th>)
}
  )
  )
}
const TableTrTest =  ({respJson}) =>{
  
const data = respJson 
return(
  <>
  {
    data.map((ele)=>{

      
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
export  function TableGet2({respJson, minWitdh='1051px'}) {
  
 const array  = respJson
          return(
          <div className="result">
     <table className="infoTable" style={{'minWidth':`${minWitdh}`}}>
            <thead className="table_header">
              <tr>
                  {<TableThTest respJson={array}/> }      
    
              </tr>
            </thead>
            <tbody className="table_body">
              <TableTrTest respJson={array} />
          
        </tbody>
      </table>
          </div>
     
            )}