import React from 'react';
import { Link, useNavigate, useParams} from 'react-router-dom'
import { useState } from 'react';
import '../styles/Post.css';
import { useEffect } from 'react'
import axios from "axios";
import '../styles/Post.css'
import useFetch from '../hooks/fetch.hook'; 
import convertToBase64 from "../helper/convert";
import { addBookmark, getPost, updatePost, removeBookmark, addComment} from '../helper/helper';
import {BsBookmarksFill, BsBookmarks} from 'react-icons/bs'
export default function Post() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [postData, setPostData] = useState()
  const[{isLoading, apiData, serverError}] = useFetch()
  const {params} = useParams()
  const [bookmarked, setBookmarked]= useState()
  useEffect(() => {
    async function fetchData() {
      try {
        const postData = await getPost(params);
        setPostData(postData.data);
        setComments(postData.data.comments)
        setRating(postData.data.rating)
        setBookmarked(apiData?.bookmarkedPosts.some(item=>item==params))
        
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [apiData]);

  const handleRatingChange = async (event) => {{/*Rating Callback */}
    setRating(parseInt(event.target.value));
    try {
      // const response = await axios.put(`/api/post/${params}/updatePost`, { rating }); this works as well
      const response = updatePost(params,{rating})
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLikeClick = () => {
    setLikes(likes + 1);{/*Like count*/}
  }

  const handleCommentSubmit = async (event) => {{/*comment callback*/}
    event.preventDefault();
    
    try{
      const id = await apiData?._id
      const username = await apiData?.username
      const newComment = { text: commentInput, postedBy: { username: username} }
      const updatedComments = [...comments, newComment]
      // const response = await updatePost(params,{...postData, comments: [...comments,{text:commentInput,postedBy:id}]})
      const body = {text:commentInput,postedBy:id}
      const response = await addComment(postData._id,body)
      setComments(updatedComments)
      setCommentInput("")
    }catch(error){
      console.log(error)
    }
  }
  function userLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }
  async function handleBookmarks(){
    const username = apiData?.username
    const postId = postData._id
    if(bookmarked){  
      try{
        const response = await removeBookmark(username,postId)
        if(response){
          setBookmarked(false)
        }
      }catch(error){
        console.log(error)
      }
    }
    else{
      try{
        const response = await addBookmark(username,postId)
        if(response){
          setBookmarked(true)
        }
      }catch(error){
        console.log(error)
      }
    }
  }
  if( isLoading){
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <nav>
        <div className="logo">
          <Link to="/Homepage">SpaceFood</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/Username" onClick={userLogout}>Logout</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    <div className="post-container">
      {bookmarked? <BsBookmarksFill className='bookmark' onClick={handleBookmarks}/>:<BsBookmarks className='bookmark' onClick={handleBookmarks}/>}
      {/* {bookmarked ==true ? <BsBookmarksFill className='bookmark' onClick={handleBookmarks}/> : <BsBookmarks className='bookmark' onClick={handleBookmarks}/>} */}
      <h2 className="post-title">{postData&& postData.title}</h2>
      <h3>Posted by: {postData && postData.owner.username}</h3>
      <img className="post-image" src={postData && postData.photo} alt="Main Post Image" />{/*Image Backend */}
      <p className="post-description">{postData && postData.description}</p>{/*Description backend*/}
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
        <div className="rating">
          <div className="stars">
            <input type="radio" id="star5" name="rating" value="1" onChange={handleRatingChange} />{/*ratin callback */}
            <label htmlFor="star5">&#9733;</label>
            <input type="radio" id="star4" name="rating" value="2" onChange={handleRatingChange} />
            <label htmlFor="star4">&#9733;</label>
            <input type="radio" id="star3" name="rating" value="3" onChange={handleRatingChange} />
            <label htmlFor="star3">&#9733;</label>
            <input type="radio" id="star2" name="rating" value="4" onChange={handleRatingChange} />
            <label htmlFor="star2">&#9733;</label>
            <input type="radio" id="star1" name="rating" value="5" onChange={handleRatingChange} />
            <label htmlFor="star1">&#9733;</label>
          </div>
        </div>
      </div>

      <div className="comments-container">
        <h3>Comments:</h3>
        <form onSubmit={handleCommentSubmit}>{/*Comments handler */}
          <input type="text" placeholder="Add a comment..." value={commentInput} onChange={(event) => setCommentInput(event.target.value)} className="comment-input" />
          <button type="submit" className="comment-submit-btn">Post</button>
        </form>
        <ul className="comments-list">
          {comments&&comments.map((comment, index) => (
            <li key={index} className="comment"><Link to={`/viewProfile/${comment.postedBy.username}`}>{comment.postedBy.username}</Link>: {comment.text}</li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

