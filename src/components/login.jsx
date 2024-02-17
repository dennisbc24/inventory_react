import React, { useState, useEffect } from "react";
import {  InputSimple} from "./form/inputSearch";
import loginServices from "../services/login"
import "./salesForm.css";


let userGlobal;

const Acceso = () =>{
    return(
        <p>Usuario si existe</p>
    )
}

const Form = () => {
const [email, setEmail] = useState(null)
const [password, setPassword] = useState(null)
const [user, setUser] = useState(null)

const handleEmail = ({target: { value }}) => {setEmail(value)}
const handlePassword = ({target: { value }}) => {setPassword(value)}
const handleLogin =  async (e) => {
    e.preventDefault()
    try {
        console.log(email, password);
        const user = await loginServices.login({
            email, 
            password
        })
        console.log(user);
        setUser(user)
        setEmail('')
        setPassword('')
    } catch (error) {
        console.error(error);
    }
    
}
    return(
        <>
        <form onSubmit={handleLogin}>
        <InputSimple tipo="email" titulo="Email: " func={handleEmail}/>
        <InputSimple tipo="password" titulo="Contraseña: " func={handlePassword}/>
        <button>Login</button>
        </form>
        
        </>
    )
}

 export const Login = () =>{
    const [user, setUser] = useState(userGlobal)
    return(
        <>
           {user ? <Acceso/> : <Form/>}
        </>
    )
}
