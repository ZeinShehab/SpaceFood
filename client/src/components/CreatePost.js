import React, { useState } from "react";
import axios from "axios";
import '../styles/Post.css'
import useFetch from '../hooks/fetch.hook'; 
import convertToBase64 from "../helper/convert";
import { Link, useNavigate} from 'react-router-dom'
import { toast, Toaster } from "react-hot-toast";
import {createPost} from '../helper/helper'
import {RxCross2} from 'react-icons/rx'
export default function CreatePost(){
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState();
    const [description,setDescription] = useState("")
    const handleTitleChange = (e) => setTitle(e.target.value);
    const [tags, setTags] = useState([]);
    const [{ isLoading, apiData, serverError }] = useFetch();
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
          // const response = await axios.post(`/api/user/${username}/createPost`, {
          //     title,
          //     photo,
          //     description,
          //     tags,
          //     owner: apiData
          // },{ headers : { "Authorization" : `Bearer ${token}`}});
          // alert("Post created successfully!");
          const promise = createPost(username, title, photo, description, tags, apiData, token);
          toast.promise(promise, {
            loading: 'Creating...',
            success: () => <b>Post Created Successfully</b>,
            error: <b>We're sorry something went wrong, try again later!</b>,
          }).then(()=>{navigate('/Homepage')});
          
      } catch (error) {
        console.error(error);
        alert("Failed to create post");
      }
    };
    const navigate = useNavigate()
    function userLogout() {
      localStorage.removeItem('token')
      navigate('/')
    }
    return (
    <div>
      <nav>
        <div className="logo">
          <Link to="/Homepage">SpaceFood</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" onClick={userLogout}>Logout</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    <form className="post-container" onSubmit={handleSubmit}>
    <Toaster position='top-center' reverseOrder={false}></Toaster>
      {/* <h2 className="post-title" onChange={handleTitleChange}>{title}</h2> */}
      <label htmlFor="title">
        <input className="create-post-title" id="title" onChange={handleTitleChange} value={title} placeholder="Enter Title"/>
      </label>
      <div className="flex">
        
                {photo!=null? 
                    <label htmlFor="img">
                    <img className="create-post-image"  src={photo} />
                    <input onChange={onUpload} type="file" id='img' name='img' />
                    </label>
                    : 
                    <label htmlFor="img"> <img src="https://via.placeholder.com/300x200"  className="create-post-image" alt="Post Image"/><input onChange={onUpload} type="file" id='img' name='img' /></label>
                    }
        
        {/* <p className="post-description" onChange={handleDescriptionChange}>{description}</p> */}
        <textarea className="create-post-description" onChange={handleDescriptionChange} placeholder="Enter Description" type="textarea"/>
      </div>
      <input
            className="create-post-tags"
            placeholder="Enter tags (press Enter to add)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                const newTag = e.target.value.trim();
                if (newTag) {
                  setTags([...tags, newTag]);
                  e.target.value = "";
                }
              }
            }}
          />

          <div className="create-post-tags-container">
  {tags.map((tag, index) => (
    <div key={index} className="create-post-tag flex">
      {tag}
      <RxCross2 className="remove-tag"
        onClick={() => {
          setTags(tags.filter((t) => t !== tag));
        }}
      />
    </div>
  ))}
</div>

    <button className="submit-post" type="submit">Create Post</button>
    </form>
    
    </div>
      
    );
  };
  
  