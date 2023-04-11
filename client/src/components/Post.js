import React, { useState } from "react";
import axios from "axios";
import '../styles/Post.css'
import useFetch from '../hooks/fetch.hook'; 
export default function Post(){
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handlePhotoChange = (e) => setPhoto(e.target.value);
  const [{ isLoading, apiData, serverError }] = useFetch();
  const username = apiData?.username;
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
        const user = await axios.get(`/api/user/${username}`)
        const token = await localStorage.getItem('token');
        await axios.post(`/api/user/${username}/createPost`, {
            title,
            photo,
            owner: apiData
        },{ headers : { "Authorization" : `Bearer ${token}`}});
        setTitle("");
        setPhoto("");
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
      <label>
        Photo URL:
        <input type="text" value={photo} onChange={handlePhotoChange} />
      </label>
      <br />
      <button type="submit">Create Post</button>
    </form>
  );
};

