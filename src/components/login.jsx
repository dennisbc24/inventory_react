import React, { useState } from "react";
import {  InputSimple, ButtonSave} from "./form/inputSearch";
import loginServices from "../services/login"
import "./login.css";

export const Login = ({urlBase, inicio}) => {
const [email, setEmail] = useState(null)
const [password, setPassword] = useState(null)

const handleEmail = ({target: { value }}) => {setEmail(value)}
const handlePassword = ({target: { value }}) => {setPassword(value)}
const handleLogin =  async (e) => {
    e.preventDefault()
    try {
        const user = await loginServices.login(urlBase, {
            email, 
            password
        })
               
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
        <main className="box">
            <h1 className="title_form">Iniciar Sesión</h1>
            <form className="login" onSubmit={handleLogin}>
            <InputSimple tipo="email" titulo="Email: " func={handleEmail}/>
            <InputSimple tipo="password" titulo="Contraseña: " func={handlePassword}/>
            {/* <button className="button_form">Iniciar Sesión</button> */}
            <ButtonSave titulo={'Iniciar Sesión'}/>
            </form>
            {/* <button onClick={inicio}>login</button> */}
        </main>
        
        </>
    )
}

