import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Post.css'
import useFetch from '../hooks/fetch.hook';
import convertToBase64 from "../helper/convert";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast, Toaster } from "react-hot-toast";
import { createPost, getPost } from '../helper/helper'
import { RxCross2 } from 'react-icons/rx'
export default function EditPost() {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState();
  const [description, setDescription] = useState("")
  const handleTitleChange = (e) => setTitle(e.target.value);
  const [tags, setTags] = useState([]);
  const [{ isLoading, apiData, serverError }] = useFetch();
  const {params} = useParams();
  const [post,setPost] = useState()
  const username = apiData?.username;
  const navigate = useNavigate()
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setPhoto(base64);
  }
  useEffect(()=>{
    async function fetchPost(){
        const post = await getPost(params)
        setPost(post.data)
        setTitle(post.data.title)
        setTags(post.data.tags)
        setDescription(post.data.description)
        setPhoto(post.data.photo)
    }
    fetchPost()
  },[params])

  const handleDescriptionChange = (e) => setDescription(e.target.value)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = axios.put(`/api/Post/${post._id}/editPost`,{title,description,photo,tags})
        toast.promise(response,{
            loading: 'updating...',
            success: 'Post updated successfully',
            error: 'Something went wrong. Try again later.'
        }).then(() => { navigate('/Homepage') });
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    }
  };
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
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/" onClick={userLogout}>Logout</Link>
          </li>
        </ul>
      </nav>
      <form className="post-container" onSubmit={handleSubmit}>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        {/* <h2 className="post-title" onChange={handleTitleChange}>{title}</h2> */}
        <label className="title-glass" htmlFor="title">
          <input className="create-post-title" id="title" onChange={handleTitleChange} defaultValue={post&&post.title || ""} placeholder="Enter Title" />
        </label>
        <div className="post-a-recipe-card">

          {photo != null ?
            <label htmlFor="img">
              <img className="create-post-image" src={photo} />
              <input onChange={onUpload} type="file" id='img' name='img' />
            </label>
            :
            <label htmlFor="img"> <img src="https://i0.wp.com/css-tricks.com/wp-content/uploads/2015/11/drag-drop-upload-2.gif" className="create-post-image" alt="Post Image" /><input onChange={onUpload} type="file" id='img' name='img' /></label>
          }

          {/* <p className="post-description" onChange={handleDescriptionChange}>{description}</p> */}
        
        <div className="create-post-description-tags">
          <textarea className="create-post-description"onChange={handleDescriptionChange} defaultValue={post&&post.description || ""} placeholder="Enter Description" type="textarea" />
        <div className="create-post-tag-input-container">
          <input
            maxLength={17}
            className="create-post-tag-input"
            placeholder="Tags (Enter to add)"
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
          <div className="create-post-tag-container">
          {post&&post.tags&&tags.map((tag, index) => (
            <div key={index} className="create-post-tag">
              {tag}
              <RxCross2 className="remove-tag"
                onClick={() => {
                  setTags(tags.filter((t) => t !== tag));
                }}
              />
            </div>
          ))}
          </div>
        </div>
        </div>
          <button className="submit-post" type="submit">Update Post</button>

     </div>
      </form>
    </div>

  );
};

