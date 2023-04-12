import React, { useState } from "react";
import axios from "axios";
import '../styles/Post.css'
import useFetch from '../hooks/fetch.hook'; 
import convertToBase64 from "../helper/convert";
export default function Post(){
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState();
  const [description,setDescription] = useState("")
  const handleTitleChange = (e) => setTitle(e.target.value);
  
  const [{ isLoading, apiData, serverError }] = useFetch();
  const [file, setFile] = useState();
  const username = apiData?.username;
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setPhoto(base64);
  }
  const handleDescriptionChange = (e) => setDescription(e.target.value)

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
        const user = await axios.get(`/api/user/${username}`)
        const token = await localStorage.getItem('token');
        // console.log(file, title)
        await axios.post(`/api/user/${username}/createPost`, {
            title,
            photo,
            owner: apiData
        },{ headers : { "Authorization" : `Bearer ${token}`}});
        setTitle("");
        alert("Post created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    }
  };
  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={handleTitleChange} />
      </label>
      <br />
      
        
          {photo!=null? 
        <label htmlFor="img">
            <img src={photo} />
            <input onChange={onUpload} type="file" id='img' name='img' />
          </label>
            : 
          <label htmlFor="img">
            Choose File
          <input onChange={onUpload} type="file" id='img' name='img' />
      </label>}
      <br />
      <label >Description: 
        <input type="text" value={description} onChange={handleDescriptionChange}/>
      </label>
      <button type="submit">Create Post</button>
    </form>
  );
};

