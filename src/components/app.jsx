import { useState, useEffect, useContext } from 'react'

import {MainMenu} from './menuDespelgable.jsx'
import { Route, Routes } from "react-router-dom";
import { ButtonSave} from "./form/inputSearch";

import {SelesForm} from "./salesForm.jsx";
import {NewProduct} from "./newProduct.jsx";
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
import {Box} from './box.jsx'

import { ContextGlobal  } from "../context/globalContext.jsx";
import "./theme.css";

import { TableGet } from './table.jsx';

export function App(){
    
const {urlGlobal} = useContext(ContextGlobal)
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

<Route path='/' element={  user ?  <>  
            <MainMenu/> 
            <ButtonSave titulo={'Cerrar Sesión'} func={logout} />
            <SelesForm urlBase={urlGlobal}/>
        </>
:  <Login urlBase={urlGlobal} inicio={login}/>
     }/>
    
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/newProduct'element={<NewProduct urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/expense' element={<SendExpense urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/deleteSale' element={<DeleteSale urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin','seller','viewer']} user={user}/>}>
        <Route path='/putSale' element={<SelesForm urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/entries' element={<EntriesForm urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['seller','admin','viewer']} user={user}/>}>
        <Route path='/searchSales' element={<SearchSale urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/updateProduct' element={<UpdateProductForm urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin','seller','viewer']} user={user}/>}>
        <Route path='/inventory' element={<Inventory urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/transactions' element={<TransactionsForm urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/searchSpends' element={<SearchSpends urlBase={urlGlobal} token={token}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/summaries' element={<SearchSummary urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin','viewer']} user={user}/>}>
        <Route path='/inventorySearch' element={<InventorySearchForm urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/existenceCount' element={<UpdateExistenceCount urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin','viewer']} user={user}/>}>
        <Route path='/sumSalesMonthly' element={<Monthly urlBase={urlGlobal}/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/products' element={<TableGet url={`${urlGlobal}/api/v1/products`} minWitdh="900px"/>}/>
    </Route>
    <Route element={<ProtectedRoute isAllow={!!user} allowedRoles={['admin']} user={user}/>}>
        <Route path='/box' element={<Box urlBase={urlGlobal}/>}/>
    </Route>

    

</Routes>
    
    
        
        </>
)
}