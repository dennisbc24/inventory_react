import React from 'react'

import '../css/popupwindow.css'

export function PopUpWindow({text}) {
    return(
  
    <div className='popup_frame'>
    <h3 className='title_popupwindow'>{text}</h3>
    <button className='pop_up_button'>aceptar</button>
    <img src="/src/components/img/no_imagen.png" alt="" />

  </div>      



    )  
}
