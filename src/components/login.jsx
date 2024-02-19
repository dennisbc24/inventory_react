import React, { useState } from "react";
import {  InputSimple} from "./form/inputSearch";
import loginServices from "../services/login"
import "./salesForm.css";


export const Login = ({urlBase, inicio}) => {
const [email, setEmail] = useState(null)
const [password, setPassword] = useState(null)


const handleEmail = ({target: { value }}) => {setEmail(value)}
const handlePassword = ({target: { value }}) => {setPassword(value)}
const handleLogin =  async (e) => {
    e.preventDefault()
    try {
        console.log(email, password);
        const user = await loginServices.login(urlBase, {
            email, 
            password
        })
        console.log(user);
        
        setEmail('')
        setPassword('')
        inicio(user)
        window.localStorage.setItem(
            "loggedAppUser", JSON.stringify(user)
        )
    } catch (error) {
        console.error(error);
    }
    
}
    return(
        <>
        <form onSubmit={handleLogin}>
        <InputSimple tipo="email" titulo="Email: " func={handleEmail}/>
        <InputSimple tipo="password" titulo="Contraseña: " func={handlePassword}/>
        <button>Iniciar Sesión</button>
        
        </form>
        {/* <button onClick={inicio}>login</button> */}
        </>
    )
}

