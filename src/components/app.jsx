import React from 'react'

import {MainMenu} from './menuDespelgable.jsx'
import { Route, Routes } from "react-router-dom";


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

//const home = "https://inventario.elwayardo.com";
const home = 'http://localhost:3000'

export function App(){
    return(<>
    <MainMenu></MainMenu>
    <Routes>
        <Route path='/' element={<SelesForm urlBase={home}/>}/>
        <Route path='/newProduct' element={<NewProduct urlBase={home}/>}/>
        <Route path='/expense' element={<SendExpense urlBase={home}/>}/>
        <Route path='/entries' element={<EntriesForm urlBase={home}/>}/>
        <Route path='/searchSales' element={<SearchSale urlBase={home}/>}/>
        <Route path='/deleteSale' element={<DeleteSale urlBase={home}/>}/>
        <Route path='/updateProduct' element={<UpdateProductForm urlBase={home}/>}/>
        <Route path='/inventory' element={<Inventory urlBase={home}/>}/>
        <Route path='/transactions' element={<TransactionsForm urlBase={home}/>}/>
        <Route path='/searchSpends' element={<SearchSpends urlBase={home}/>}/>
        <Route path='/summaries' element={<SearchSummary urlBase={home}/>}/>
    </Routes>
        
        </>
)
}