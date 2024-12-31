import { useState, useEffect } from 'react'

import {MainMenu} from './menuDespelgable.jsx'
import { Route, Routes } from "react-router-dom";
import { ButtonSave} from "./form/inputSearch";

import {SelesForm} from "./salesForm.jsx";
import {NewProduct} from "./newProduct.jsx";
import {Box} from "./box.jsx";
import {SendExpense} from "./spending.jsx";

import {EntriesForm} from "./entries.jsx";
import {SearchSale} from "./searchSale.jsx";
import {DeleteSale} from "./deleteSale.jsx";
import {UpdateProductForm} from "./updateProducts.jsx";
import {Inventory} from "./inventory.jsx";
import {TransactionsForm} from "./transactions.jsx";
import {SearchSpends} from "./searchSpends.jsx";
import {SearchSummary} from "./summaries.jsx";
import {InventorySearchForm} from "./inventory_search_form.jsx";
import {UpdateExistenceCount} from "./updateExistenceCount.jsx";
import {Login} from "./login.jsx";
import {ProtectedRoute} from './ProtectedRoute.jsx'
import {Monthly} from './searchs/sumSalesMonthly.jsx'

import "./theme.css";

import { TableGet } from './table.jsx';

//const home = "https://inventario.elwayardo.com";
const home = 'http://localhost:3000'

export function App(){
    const [user, setUser] = useState(null)
    const [token] = useState()

    const login = (user) =>{setUser(user)}
    const logout = () => {
        window.localStorage.removeItem('loggedAppUser')
        setUser(null)
    }

useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if(loggedUserJSON){
        setUser(JSON.parse(loggedUserJSON))
        
    }

}, [])


    return(
    <>  
    <Routes>

    <Route path='/' element={
    user ?  <>  
                <MainMenu/> 
                <ButtonSave titulo={'Cerrar Sesión'} func={logout} />
                <SelesForm urlBase={home}/>
            </>
    :  <>
            <Login urlBase={home} inicio={login}/>
        </> }/>
        
        <Route element={<ProtectedRoute isAllow={!!user}/>}>
            <Route path='/newProduct' element={<NewProduct urlBase={home}/>}/>
            <Route path='/deleteSale' element={<DeleteSale urlBase={home}/>}/>
            <Route path='/expense' element={<SendExpense urlBase={home}/>}/>
            <Route path='/box' element={<Box urlBase={home}/>}/>

            <Route path='/putSale' element={<SelesForm urlBase={home}/>}/>
            <Route path='/entries' element={<EntriesForm urlBase={home}/>}/>
            <Route path='/searchSales' element={<SearchSale urlBase={home}/>}/>
            <Route path='/updateProduct' element={<UpdateProductForm urlBase={home}/>}/>
            <Route path='/inventory' element={<Inventory urlBase={home}/>}/>
            <Route path='/transactions' element={<TransactionsForm urlBase={home}/>}/>
            <Route path='/searchSpends' element={<SearchSpends urlBase={home} token={token}/>}/>
            <Route path='/summaries' element={<SearchSummary urlBase={home}/>}/>
            <Route path='/inventorySearch' element={<InventorySearchForm urlBase={home}/>}/>
            <Route path='/existenceCount' element={<UpdateExistenceCount urlBase={home}/>}/>
            <Route path='/sumSalesMonthly' element={<Monthly urlBase={home}/>}/>
            <Route path='/products' element={<TableGet url={`${home}/api/v1/products`} minWitdh="900px"/>}/>


            
        </Route>
    
    </Routes>
        
        </>
)
}