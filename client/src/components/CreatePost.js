import React, { useState } from "react";
import axios from "axios";
import '../styles/Post.css'
import useFetch from '../hooks/fetch.hook'; 
import convertToBase64 from "../helper/convert";
import { Link, useNavigate} from 'react-router-dom'
export default function CreatePost(){
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState();
    const [description,setDescription] = useState("")
    const [tags, setTags] = useState([]);
    const handleTitleChange = (e) => setTitle(e.target.value);
    
    const [{ isLoading, apiData, serverError }] = useFetch();
    const username = apiData?.username;
    const onUpload = async e => {
      const base64 = await convertToBase64(e.target.files[0]);
      setPhoto(base64);
    }
    
    const handleDescriptionChange = (e) => setDescription(e.target.value)

    const onTagAdd = async (e) => {
        setTags(tags => [...tags, e.target.value[0]]);
    }

    const handleSubmit = async (e) => {  
      e.preventDefault();
      try {
          const user = await axios.get(`/api/user/${username}`)
          const token = await localStorage.getItem('token');
          // console.log(file, title)
          await axios.post(`/api/user/${username}/createPost`, {
              title,
              photo,
              description,
              owner: apiData
          },{ headers : { "Authorization" : `Bearer ${token}`}});
          alert("Post created successfully!");
          navigate('/Homepage')
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
    //   <form className="create-post-form" onSubmit={handleSubmit}>
    //     <label>
    //       Title:
    //       <input type="text" value={title} onChange={handleTitleChange} />
    //     </label>
    //     <br />
        
          
    //         {photo!=null? 
    //       <label htmlFor="img">
    //           <img src={photo} />
    //           <input onChange={onUpload} type="file" id='img' name='img' />
    //         </label>
    //           : 
    //         <label htmlFor="img">
    //           Choose File
    //         <input onChange={onUpload} type="file" id='img' name='img' />
    //     </label>}
    //     <br />
    //     <label >Description: 
    //       <input type="text" value={description} onChange={handleDescriptionChange}/>
    //     </label>
    //     <button type="submit">Create Post</button>
    //   </form>
    <div>
      <nav>
        <div className="logo">
          <Link to="/Homepage">SpaceFood</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/Username.js" onClick={userLogout}>Logout</Link>
          </li>
          <li>
            <Link to="/profile.js">Profile</Link>
          </li>
        </ul>
      </nav>
    <form className="post-container" onSubmit={handleSubmit}>
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
      <div className="gap4">
            {tags? tags.map((tag)=>(
            // {const url = `/Post/${post.Id}`};
            <div className="tag">
              {/* <img src={posts.photo} alt="Post Image" /> */}
              <h3>{tag}</h3>
              {/* <p>{post.description}</p> */}
            </div>
          )) :
          <input placeholder="Enter tag" onChange={onTagAdd}/>}  
      </div>

    <button className="submit-post" type="submit">Create Post</button>
    </form>
    </div>
      
    );
  };
  
  