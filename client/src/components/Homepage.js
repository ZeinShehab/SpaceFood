import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Homepage.css'
import useFetch from '../hooks/fetch.hook'
import PostList from './PostList'
import { getAllPosts } from '../helper/helper';
import Post from './Post'

export default function Homepage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState(null)
  const [{ apiData }] = useFetch()
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')

  function userLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const postsData = await getAllPosts()
        setPosts(postsData.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  let filteredPosts = posts

  if (search.trim() !== '' && posts) {
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(postTag => postTag.toLowerCase().includes(search.toLowerCase()))
    )
  }

  if (tag.trim() !== '' && posts) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
    )
  }

  return (
    <div>
      <nav className='homepage-header'>
        <div className="logo">
          <Link to="/Homepage">SpaceFood</Link>
        </div>
        <div className='search-container'>
          <input
            className="searchBar"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* <SearchIcon className='fa input-icons'></SearchIcon> */}

        </div>
        {/* <input
              className="searchBar"
              type="text"
              placeholder="Search by tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            /> */}
        <div className="nav-links">
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/" onClick={userLogout}>Logout</Link>
          </li>
        </div>
      </nav>

      <div className="recent-posts">

      <div className="TempHeader">{search.trim() !== '' ? "Search Results" : "Recent Posts"}</div>
        
        <div className="post-grid">

          {/* {posts ? posts.map((post) => (
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
          </Link>)) : <h1>Loading</h1>} */}

          {apiData && apiData.role == "Chef" ? 
          <button className='post-a-recipe-button'><Link to="/Post" className="post-a-recipe-button-circle">Post a Recipe</Link> </button> : <p></p>}

         {filteredPosts ? filteredPosts.length == 0 ? <p className='no-results'>No results</p> : filteredPosts.map(post => (

            <Link to={`/post/${post._id}`} state={post._id}>
              <div className="post" key={post._id}>
                <img src={post.photo} alt="Post Image" />
                <h3>{post.title}</h3>
                <p>{post.description.length >= 85 ? `${post.description.substring(0, 80)}...` : post.description}</p>
              </div>
            </Link>
          )) : <div className='Loading'>Loading</div>}

        </div>
      </div>
    </div>
  )
}
