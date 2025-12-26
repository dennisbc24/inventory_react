import { useState, useContext } from 'react'
import imageCompression from "browser-image-compression";
import '../css/popupwindow.css'
import axios from "axios";
import { ContextGlobal  } from "../../context/globalContext.jsx";

export function PopUpWindow({text}) {
  
  const [fileToSend, setImageToSend] = useState(null)
  const {productGlobal, urlGlobal,closeWindow, setCloseWindow} = useContext(ContextGlobal)
  const [img, setImg] = useState(productGlobal.url_image)
  const closeFunction = () => {
    setCloseWindow(closeWindow ? false : true)}
  


const handleSubmit = async (e) => {  // enviar datos del producto
 // e.preventDefault();
  const formData = new FormData();
  formData.append('cost',   [productGlobal.cost === null ? 0 : productGlobal.cost]);
  formData.append('sugested_price', [productGlobal.list_price === null ? 0 : productGlobal.list_price]);
  formData.append('wholesale_price',[productGlobal.lowest_price === null ? 0 : productGlobal.lowest_price]);
  formData.append('name', productGlobal.name);
  formData.append('nameFile', productGlobal.name.replaceAll(' ','+' ));
  formData.append('photo', fileToSend);
  console.log(formData);
  
  try {
        
    const urlPatch = `${urlGlobal}/api/v1/products/${productGlobal.id_product}`
    console.log(urlPatch);
    const sendData = await axios.patch(urlPatch, formData)
    
    alert(sendData.data);
    
  } catch (error) {
    console.error("Error al hacer el patch:", error);
  }
};


  const handleImageChange = async (e) => { // manejar cambio de imagen
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

const handleClic = () => {  // guardar cambios
  handleSubmit()
  closeFunction()
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
