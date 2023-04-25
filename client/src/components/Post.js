import React from 'react';
import { Link, useNavigate, useParams} from 'react-router-dom'
import { useState } from 'react';
import '../styles/Post.css';
import { useEffect } from 'react'
import axios from "axios";
import '../styles/Post.css'
import useFetch from '../hooks/fetch.hook'; 
import convertToBase64 from "../helper/convert";
import { addBookmark, getPost, updatePost, removeBookmark, addComment, modifyRating, deleteComment} from '../helper/helper';
import {BsBookmarksFill, BsBookmarks} from 'react-icons/bs'
import { Rating } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import toast, { Toaster } from 'react-hot-toast';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function Post() {
  const navigate = useNavigate()
  const [postRating, setPostRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [date, setDate] = useState("");
  const [hover, setHover] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [postData, setPostData] = useState()
  const[{isLoading, apiData, serverError}] = useFetch()
  const {params} = useParams()
  const [bookmarked, setBookmarked]= useState()
  const [tags, setTags] = useState([])
  const [userId, setUserId] = useState()
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
        setDate((new Date(postData.data.createdAt)).toUTCString())
        setUserId(apiData?._id)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [apiData,comments]);

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
    setRatings(ratings => [...ratings, userRating])
    
  }, [userRating])

  const handleRatingChange = async (userRating) => {{/*Rating Callback */}
    setUserRating(userRating)
    const username = apiData?.username;
    const postId = postData._id
    const response = await modifyRating(username,postId,{rating:userRating})
    if(response){
      console.log("Success")
    }
    else{
      console.log("Failed")
    }
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
    return <div className='Loading'>Loading</div>
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

  async function copyLinkToClip() {
    let copyPromise = navigator.clipboard.writeText(window.location.href);
    toast.promise(copyPromise, {
      loading: 'Copying...',
      success : <b>Link copied to clipboard!</b>,
      error: <b>Could not share!</b>
    });
  }

  function goToUserProfile() {
    if (postData) {
      navigate(`/viewProfile/${postData.owner.username}`);
    }
  }

  let labels = {0.5: "Terrible", 1:"Terrible+", 1.5:"Poor", 2:"Poor+", 2.5:"Ok", 3:"Ok+", 3.5:"Good", 4:"Good+", 4.5:"Excellent", 5:"Excellent+"}
  const deleteCommentFromList = async (username, postId, commentId) => {
    try {
      const respone = await deleteComment(username, postId, commentId);
      if(respone){
        console.log("Success")
      }
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
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

      <div className='post-header'>
        <div className="post-title">{postData && postData.title}</div>
        <div className='post-details'>
          <p className='post-author' onClick={goToUserProfile}>by: {postData && postData.owner.username}</p>
          <span className='divider'></span>
          <p className='post-date'>Updated at: {postData && date}</p>
        </div>
        <div className='post-interactions'>
          <div className='post-rating'>
            <p className='pt-1'>Rating</p>
            <Rating name="read-only" precision={0.5} value={postData ? postData.rating : 0} readOnly/>
            <span className='divider'></span>
          </div>
          <Popup trigger={
            <div>
              <button className='post-rate-button'>Rate</button>
            </div>
          } position="right center">
            <div className='flex gap-1'>
              <Rating
              name="rating"
              value={userRating}
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange(newValue)}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
            / >{
                userRating !== null && (
                <div sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : userRating]}</div>)}
            </div>
          </Popup>
          <div className='flex-1'>
            <a className='post-comments-link' href="#comments">Comments({comments.length})</a>
          </div>
        </div>
      </div>

      <div className='post-image-container'>
        <img className="post-image" src={postData && postData.photo} alt="Main Post Image" />{/*Image Backend */}
        <div className='post-image-border'>
          <div className='post-side'>
            <div className='post-bookmark' onClick={handleBookmarks}>
              Bookmark
                {bookmarked? <BsBookmarksFill className='bookmark-icon'/>:<BsBookmarks className='bookmark-icon'/>}
            </div>  
            <span className='divider-hoz'></span>
            <div className='post-print' onClick={window.print}>Print ⎙</div>
            <span className='divider-hoz'></span>
            <div className='post-bookmark' onClick={copyLinkToClip}>Share <ShareIcon></ShareIcon></div>
          </div>
        </div>
      </div>
      {/* {bookmarked ==true ? <BsBookmarksFill className='bookmark' onClick={handleBookmarks}/> : <BsBookmarks className='bookmark' onClick={handleBookmarks}/>} */}
      
      <div className = 'post-body'>
        <p className="post-description">{postData && postData.description}</p>{/*Description backend*/}
        
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

{/* <div className="box flex">
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
    </div> */}
      


      <div className="view-post-tag-container">
      {tags.map((tag, index) => (
          <div className="view-post-tag">
            {tag}
          </div>
        ))}
      </div>

      <div className="comments-container" id="comments">
        <h3>Comments:</h3>
        <form onSubmit={handleCommentSubmit}>{/*Comments handler */}
          <input type="text" placeholder="Add a comment..." value={commentInput} onChange={(event) => setCommentInput(event.target.value)} className="comment-input" />
          <button type="submit" className="comment-submit-btn">Post</button>
        </form>
        <ul className="comments-list">
          {comments&&comments.map((comment, index) => (
            <li key={index} className="comment"><Link to={`/viewProfile/${comment.postedBy.username}`}>{comment.postedBy.username}</Link>: {comment.text}
            { userId&&(comment.postedBy._id ==userId) &&(
              <button onClick={() => deleteCommentFromList(apiData?.username,postData._id,comment._id)}>
                Delete
              </button >
            )}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

