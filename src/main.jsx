import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";

import { App } from "./components/app.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
<BrowserRouter>
<App/>
</BrowserRouter>)
