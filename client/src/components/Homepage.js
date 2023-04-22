import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Homepage.css'
import { useEffect } from 'react'
import useFetch from '../hooks/fetch.hook'
import PostList from './PostList'
import { getAllPosts } from '../helper/helper';
import Post from './Post'
export default function Homepage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState();
  const [{ apiData }] = useFetch()
  function userLogout() {
    localStorage.removeItem('token');
    navigate('/')
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData.data);
        console.log(postsData)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <nav className='homepage-header'>
        <div className="logo">
          <Link to="/Homepage">SpaceFood</Link>
        </div>
        <div className="nav-links">
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/Post" >Post a recipe</Link>
          </li>
          <li>
            <Link to="/" onClick={userLogout}>Logout</Link>
          </li>
        </div>
      </nav>

      <div className="recent-posts">
        <div className="post-section">
          <div className="TempHeader">Recent Posts</div>
        </div>

        <div className="post-grid">
          {posts ? posts.map((post) => (
            // {const url = `/Post/${post.Id}`};
            <Link className='card-link' to={`/post/${post._id}`} state={post._id}>
              <div className="post">
                <div className='card-title'>{post.title}</div>
                <img src={post.photo} alt="Post Image" />
                <div className='card-description'>{
                  post.description.length >= 85 ? post.description.substring(0, 80) + "..." :
                    post.description
                }</div>
              </div>
            </Link>)) : <h1>Loading</h1>}
        </div>
      </div>
    </div>
  )
}