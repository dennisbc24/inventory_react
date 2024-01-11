import React from 'react'
import ReactDOM from 'react-dom/client'

import {MainMenu} from './menuDespelgable.jsx'
import { BrowserRouter } from "react-router-dom";
import { Route, Routes, Link } from "react-router-dom";


import {SelesForm} from "./salesForm.jsx";
import {NewProduct} from "./newProduct.jsx";
import {SendExpense} from "./spending.jsx";
import {EntriesForm} from "./entries.jsx";

export function App(){
    return(<>
    <MainMenu></MainMenu>
    <Routes>
        <Route path='/' element={<SelesForm/>}/>
        <Route path='/newProduct' element={<NewProduct/>}/>
        <Route path='/expense' element={<SendExpense/>}/>
        <Route path='/entries' element={<EntriesForm/>}/>
    </Routes>
        
        </>
)
}