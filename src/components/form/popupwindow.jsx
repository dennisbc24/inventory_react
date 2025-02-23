import React, { useState } from 'react'
import imageCompression from "browser-image-compression";
import '../css/popupwindow.css'
import axios from "axios";

export function PopUpWindow({text, imagen, closeFunction, product, urlBase}) {
  const [img, setImg] = useState(imagen)
  const [fileToSend, setImageToSend] = useState(null)

  
const handleClic = () => {
  handleSubmit()
  closeFunction()
}

const handleSubmit = async (e) => {
 // e.preventDefault();
 console.log(product)
  const formData = new FormData();
  formData.append('cost', product.cost);
  formData.append('sugested_price', product.list_price);
  formData.append('wholesale_price', product.lowest_price);
  formData.append('name', product.name);
  formData.append('nameFile', product.name.replaceAll(' ','+' ));
  formData.append('photo', fileToSend);
  console.log(formData);
  
  try {
        
    const urlPatch = `${urlBase}/api/v1/products/${product.id_product}`
    console.log(urlPatch);
    const sendData = await axios.patch(urlPatch, formData)
    console.log(sendData);
    
    alert(sendData.data);
    
  } catch (error) {
    console.error("Error al hacer el patch:", error);
  }
};
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
      
    if (file) {
             const options = {
               maxSizeMB: 1, // Tamaño máximo en MB
               maxWidthOrHeight: 700, // Máximo en píxeles
               useWebWorker: true,
             };
             try {
               const compressedFile = await imageCompression(file, options);
               const reader = new FileReader();
               setImageToSend(compressedFile)
    reader.onloadend = () => {
      setImg(reader.result);
    };
    reader.readAsDataURL(compressedFile);
               
             } catch (error) {
              console.error("Error al comprimir la imagen", error);
           }
           }
}
    return(
  
  <div className='popup_frame'>
    <button className='closeButton' onClick={closeFunction}>X</button>
    <h3 className='title_popupwindow'>{text}</h3>
    <input type="file"         accept="image/*"         onChange={handleImageChange}/>
    <img src={img} className='popup_image' alt="img_card" />
    <button className='pop_up_button' onClick={handleClic}>Guardar Cambios</button>
  </div>      



    )  
}
