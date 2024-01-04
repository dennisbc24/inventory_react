import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {MainMenu} from './components/menuDespelgable.jsx'
import { TitleForm } from "./components/form/titleForm.jsx";
import { InputSearch, InputSimple, SelectSimple, ParrafoInput } from "./components/form/inputSearch.jsx";
import {SearchBar} from "./components/barraBuscar.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
<>
<MainMenu></MainMenu>
<TitleForm text='Registrar Venta'></TitleForm>
<InputSearch></InputSearch>

<SearchBar></SearchBar>
<div>
<SelectSimple titulo='Sucursal'>
<option value="1">B17</option>
<option value="3">Qoripata</option>
<option value="7">Tambopata</option>
<option value="4">Deposito</option>
<option value="5">Los Nogales</option>
<option value="6">Los Incas</option>
</SelectSimple>
<SelectSimple titulo='Usuario'>
<option value="1">Dennis</option>
<option value="2">Luz</option>
<option value="3">Miguel</option>

</SelectSimple>
<InputSimple titulo='Fecha' tipo='date'></InputSimple>
<InputSimple titulo='Cantidad' tipo='number'></InputSimple>
<ParrafoInput titulo='Precio Unitario'></ParrafoInput>
<InputSimple titulo='Total' tipo='number'></InputSimple>
<ParrafoInput titulo='Producto'></ParrafoInput>
<ParrafoInput titulo='Costo'></ParrafoInput>
<ParrafoInput titulo='Creado'></ParrafoInput>
<InputSimple titulo='Cliente' tipo='text'></InputSimple>
</div>



</>

)
