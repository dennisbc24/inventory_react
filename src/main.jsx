import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './context/userContext.jsx';
import { App } from "./components/app.jsx";
import { GlobalProvider } from './context/globalContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
<BrowserRouter>
    <GlobalProvider>
        <UserProvider>
            <App/>
        </UserProvider>
    </GlobalProvider>
</BrowserRouter>)
