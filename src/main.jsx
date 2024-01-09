import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {MainMenu} from './components/menuDespelgable.jsx'
import { BrowserRouter } from "react-router-dom";


import {SelesForm} from "./components/salesForm.jsx";
import {NewProduct} from "./components/newProduct.jsx";
import { App } from "./components/app.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
<BrowserRouter>
<App/>
</BrowserRouter>)
