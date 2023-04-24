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
  const [postRating, setPostRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [postData, setPostData] = useState()
  const[{isLoading, apiData, serverError}] = useFetch()
  const {params} = useParams()
  const [bookmarked, setBookmarked]= useState()
  const [tags, setTags] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const postData = await getPost(params);
        setPostData(postData.data);
        setComments(postData.data.comments)
        setPostRating(postData.data.rating)
        // setUserRating(2)          // Everytime page refreshes, its like the user rated, user can rate multiple times
        const postRating =apiData?.ratedPosts.find((rating)=>rating.postId == postData.data._id)
        if(postRating){
          setUserRating(postRating.rating)
        }
        else{
          setUserRating(0)
        }
        setRatings(postData.data.ratings)
        setHoverRating(postData.data.rating)
        setBookmarked(apiData?.bookmarkedPosts.some(item=>item==params))
        setTags(postData.data.tags)
        
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [apiData]);

  const onMouseEnter = (index) => {
    setHoverRating(index);
  };
  const onMouseLeave = () => {
    setHoverRating(0);
  };

  // useEffect(() => {
  //   // console.log("Average: ", postRating);
  //   try {
  //     const response = updatePost(params,{postRating})
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // }, [postRating])
  
  // useEffect(() => {
  //   // console.log("Array: ", ratings);
  //   try {
  //     const response = updatePost(params,{ratings})

  //     let avgRating = 0;
  //     let i = 0;
  //     for (i=0; i<ratings.length; i++) {
  //       avgRating += ratings[i];
  //     }
  //     avgRating /= i;
  //     setPostRating(avgRating);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [ratings])

  useEffect(() => {
    console.log("UserRating:", userRating);
    setRatings(ratings => [...ratings, userRating])
  }, [userRating])

  const handleRatingChange = async (userRating) => {{/*Rating Callback */}
    setUserRating(userRating)
    // setPostRating(parseInt(event));
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

  function StarIcon(props) {
    const { fill = 'none' } = props;
    return (
      <svg class="w-6 h-6" fill={fill} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
    );
  }

  function RatingIcon(props) {
    const {
      index,
      userRating,
      hoverRating,
      onMouseEnter,
      onMouseLeave,
      onHandleRatingChange,
    } = props;
    const fill = React.useMemo(() => {
      if (hoverRating >= index) {
        return 'yellow';
      } else if (!hoverRating && userRating >= index) {
        return 'yellow';
      }
      return 'none';
    }, [userRating, hoverRating, index]);
    return (
        <div 
          className="cursor-pointer"
          onMouseEnter={() => onMouseEnter(index)} 
          onMouseLeave={() => onMouseLeave()} 
          onClick={() => onHandleRatingChange(index)}
          onDoubleClick={() => {
            setUserRating(0);
            setHoverRating(0);
          }}>
          <StarIcon fill={fill} />
        </div>
    )
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
            <Link to="/Username" onClick={userLogout}>Logout</Link>
          </li>
        </ul>
      </nav>
    <div className="post-container">
      {bookmarked? <BsBookmarksFill className='bookmark' onClick={handleBookmarks}/>:<BsBookmarks className='bookmark' onClick={handleBookmarks}/>}
      {/* {bookmarked ==true ? <BsBookmarksFill className='bookmark' onClick={handleBookmarks}/> : <BsBookmarks className='bookmark' onClick={handleBookmarks}/>} */}
      <h2 className="post-title">{postData&& postData.title}</h2>
      <h3>Posted by: {postData && postData.owner.username}</h3>
      <div className = 'post-body'>
        <p className="post-description">{postData && postData.description}</p>{/*Description backend*/}
        <img className="post-image" src={postData && postData.photo} alt="Main Post Image" />{/*Image Backend */}
        
      </div>
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

<div className="box flex">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <RatingIcon 
            index={index} 
            userRating={userRating} 
            hoverRating={hoverRating} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave} 
            onHandleRatingChange={handleRatingChange} />
        )
      })}
    </div>
      


      <div className="view-post-tag-container">
      {tags.map((tag, index) => (
          <div className="view-post-tag">
            {tag}
          </div>
        ))}
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

