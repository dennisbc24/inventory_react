import React from 'react'

import './popupwindow.css'

export function PopUpWindow({text}) {
    return(
<div className='popup_frame'>
    <h3 className='title_popupwindow'>{text}</h3>
    <button>aceptar</button>
</div>


    )  
}