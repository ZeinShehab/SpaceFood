import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Homepage.css'
import { useEffect } from 'react'
import useFetch from '../hooks/fetch.hook'
import PostList from './PostList'
import { getAllPosts } from '../helper/helper';
import Post from './Post'
// import {getCategories} from '../redux/actions/categoryActions';
export default function Homepage() {
  const [text, setText] = useState('');
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

  // const handleSearch = e => {
  //   setText(e.target.value);

  //   dispatch(getProductsByFilter({type: 'text,', query: e.target.value}))
  // }
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
          <li>
            <Link to="/Post" >Post a recipe</Link>
          </li>
        </ul>
      </nav>

      <section className="recent-posts">
        <div className="post-section">
          <h2 className="TempHeader">Recent Posts</h2>
        </div>
        <div className='search-bar'>
          <div className='text-muted'>
            {/* Filters <span className='fad fa-sliders-h'> </span> */}
          </div>
          <nav className='navbar navbar-expand-lg navbar-light bg-light border-top p-3'>
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"  />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </nav>
          <div>

          </div>
        </div>
        <div className="post-grid">
          {posts ? posts.map((post) => (
            // {const url = `/Post/${post.Id}`};
            <Link to={`/post/${post._id}`} state={post._id}>
              <div className="post">
                <img src={post.photo} alt="Post Image" />
                <h3>{post.title}</h3>
                <p>{
                  post.description.length >= 85 ? post.description.substring(0, 80) + "..." :
                    post.description
                }</p>
              </div>
            </Link>)) : <h1>Loading</h1>}
        </div>
      </section>
    </div>
  )
}