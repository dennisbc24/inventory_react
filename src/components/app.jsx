import React from 'react'
import ReactDOM from 'react-dom/client'

import {MainMenu} from './menuDespelgable.jsx'
import { BrowserRouter } from "react-router-dom";
import { Route, Routes, Link } from "react-router-dom";


import {SelesForm} from "./salesForm.jsx";
import {NewProduct} from "./newProduct.jsx";
import {SendExpense} from "./spending.jsx";
import {EntriesForm} from "./entries.jsx";
import {SearchSale} from "./searchSale.jsx";
import {DeleteSale} from "./deleteSale.jsx";
import {UpdateProductForm} from "./updateProducts.jsx";
import {Inventory} from "./inventory.jsx";
import {TransactionsForm} from "./transactions.jsx";

//const home = "https://inventario.elwayardo.com";
const home = 'http://localhost:3000'

export function App(){
    return(<>
    <MainMenu></MainMenu>
    <Routes>
        <Route path='/' element={<SelesForm urlBase={home}/>}/>
        <Route path='/newProduct' element={<NewProduct urlBase={home}/>}/>
        <Route path='/expense' element={<SendExpense/>}/>
        <Route path='/entries' element={<EntriesForm/>}/>
        <Route path='/searchSales' element={<SearchSale/>}/>
        <Route path='/deleteSale' element={<DeleteSale/>}/>
        <Route path='/updateProduct' element={<UpdateProductForm/>}/>
        <Route path='/inventory' element={<Inventory/>}/>
        <Route path='/transactions' element={<TransactionsForm/>}/>
    </Routes>
        
        </>
)
}