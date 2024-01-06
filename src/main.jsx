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


<SearchBar></SearchBar>




</>

)
