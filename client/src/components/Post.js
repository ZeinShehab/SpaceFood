import React from 'react';
import { useState } from 'react';
import '../styles/Post.css';

export default function Post(props) {
  const [rating, setRating] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  }

  const handleLikeClick = () => {
    setLikes(likes + 1);
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    setComments([...comments, commentInput]);
    setCommentInput("");
  }

  return (
    <div className="post-container">
      <h2 className="post-title">Delicious Pizza Recipe{props.title}</h2>
      <img className="post-image" src={props.mainImage} alt="Main Post Image" />
      <img src="https://via.placeholder.com/300x200" alt="Post Image" />
      <p className="post-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut dolor eu nisl dictum fringilla. Etiam viverra metus a nisi bibendum, vel consequat enim ullamcorper.{props.description}</p>

      <div className="other-images-container">
        <h3>Other Photos:</h3>
        <div className="other-images-slideshow">
          {Array.isArray(props.otherImages) && props.otherImages.map((image) => (
            <img key={image} src={image} alt="Post Image" className="other-image" />
          ))}
        </div>
      </div>

      <div className="post-interactions">
        <div className="post-reactions">
        <button className="like-btn" onClick={handleLikeClick}>
            <img src={require('../assets/burger.png')} alt="Burger Icon" />
        </button>
          <p className="likes-count">{likes}</p>
        </div>
        <form onSubmit={handleCommentSubmit}>
          <input type="text" placeholder="Add a comment..." value={commentInput} onChange={(event) => setCommentInput(event.target.value)} className="comment-input" />
          <button type="submit" className="comment-submit-btn">Post</button>
        </form>
        <div className="rating">
          <p>Rate this recipe:</p>
          <div className="stars">
            <input type="radio" id="star5" name="rating" value="5" onChange={handleRatingChange} />
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
  );
}