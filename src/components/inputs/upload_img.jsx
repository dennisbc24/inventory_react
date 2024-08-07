import axios from 'axios';
import { useState } from 'react';

const uploadFile = (formDataParam) => {

  fetch('http://localhost:3000/api/v1/products/files',{
      method:'POST',
      body:formDataParam
  })

};



export const UploadPhoto = () => {
  const [photo, setPhoto] = useState(null);
  const [data, setData] = useState({
    name: '',
    description: ''
  });

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(photo);
    formData.append('photo', photo);
    console.log(data);
    formData.append('name', data.name);
    formData.append('description', data.description);
    

    try {
      console.log(formData.getAll('photo'));
      const response = await axios.post('http://localhost:3000/api/v1/products/files', formData, {
        
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading the file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType='multipart/form-data'>
      <div>
        <label htmlFor="file">Photo:</label>
        <input type="file" id="file" name="foto" onChange={handlePhotoChange} />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={data.name} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" value={data.description} onChange={handleInputChange} />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadPhoto;
