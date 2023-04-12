import React from 'react';
import { Link, useNavigate} from 'react-router-dom'
import { useState } from 'react';
import '../styles/Post.css';

export default function Post(props) {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const handleRatingChange = (event) => {{/*Rating Callback */}
    setRating(parseInt(event.target.value));
  }

  const handleLikeClick = () => {
    setLikes(likes + 1);{/*Like count*/}
  }

  const handleCommentSubmit = (event) => {{/*comment callback*/}
    event.preventDefault();
    setComments([...comments, commentInput]);
    setCommentInput("");
  }
  function userLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div>
      <nav>
        <div className="logo">
          <Link to="/Homepage.js">SpaceFood</Link>
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
    <div className="post-container">
      <h2 className="post-title">Delicious Pizza Recipe{props.title}</h2>
      <img className="post-image" src={props.mainImage} alt="Main Post Image" />{/*Image Backend */}
      <img src="https://via.placeholder.com/300x200" alt="Post Image" /> {/*place holder */}
      <p className="post-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut dolor eu nisl dictum fringilla. Etiam viverra metus a nisi bibendum, vel consequat enim ullamcorper. This is just a place holder{props.description}</p>{/*Description backend*/}
      {/*Image Backend 
      <div className="other-images-container">
        <h3>Other Photos:</h3>
        <div className="other-images-slideshow">
          {Array.isArray(props.otherImages) && props.otherImages.map((image) => (
            <img key={image} src={image} alt="Post Image" className="other-image" />
          ))}
        </div>
      </div>
          */}

      <div className="post-interactions">
        <div className="post-reactions">
        <button className="like-btn" onClick={handleLikeClick}>{/*LIke count */}
            <img src={require('../assets/burger.png')} alt="Burger Icon" />
        </button>
          <p className="likes-count">{likes}</p>{/*Image Backend */}
        </div>
        <form onSubmit={handleCommentSubmit}>{/*Comments handler */}
          <input type="text" placeholder="Add a comment..." value={commentInput} onChange={(event) => setCommentInput(event.target.value)} className="comment-input" />
          <button type="submit" className="comment-submit-btn">Post</button>
        </form>
        <div className="rating">
          <p>Rate this recipe:</p>{/*Rating sectoin */}
          <div className="stars">
            <input type="radio" id="star5" name="rating" value="5" onChange={handleRatingChange} />{/*ratin callback */}
            <label htmlFor="star5">&#9733;</label>
            <input type="radio" id="star4" name="rating" value="4" onChange={handleRatingChange} />
            <label htmlFor="star4">&#9733;</label>
            <input type="radio" id="star3" name="rating" value="3" onChange={handleRatingChange} />
            <label htmlFor="star3">&#9733;</label>
            <input type="radio" id="star2" name="rating" value="2" onChange={handleRatingChange} />
            <label htmlFor="star2">&#9733;</label>
            <input type="radio" id="star1" name="rating" value="1" onChange={handleRatingChange} />
            <label htmlFor="star1">&#9733;</label>
          </div>
          <p className="rating-count">{rating}/5</p>
        </div>
      </div>

      <div className="comments-container">
        <h3>Comments:</h3>
        <ul className="comments-list">
          {comments.map((comment, index) => (
            <li key={index} className="comment">{comment}</li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}
=======
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

