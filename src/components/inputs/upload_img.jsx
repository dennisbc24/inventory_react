


import axios from 'axios';
import { useState } from 'react';


/* export const Upload_Img = () => {
return(
<>
    <input type="file" name="" id="" />
</>
)
} */


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
    formData.append('photo', photo);
    formData.append('name', data.name);
    formData.append('description', data.description);

    try {
      const response = await axios.post('https://your-backend-url.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading the file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="photo">Photo:</label>
        <input type="file" id="photo" onChange={handlePhotoChange} />
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
