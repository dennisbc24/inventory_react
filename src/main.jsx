import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {MainMenu} from './components/menuDespelgable.jsx'


import {SelesForm} from "./components/salesForm.jsx";
import {NewProduct} from "./components/newProduct.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
<>
<MainMenu></MainMenu>
<SelesForm></SelesForm>
<NewProduct></NewProduct>




</>

)
