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
      post.title.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  if (tag.trim() !== '' && posts) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
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
          <h2 className="TempHeader">Recent Posts</h2>
        <div className="post-section">
          <form className="search-form">
            <input
              className="searchBar"
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              className="searchBar"
              type="text"
              placeholder="Search by tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </form>
        </div>
        <div className="post-grid">
          {filteredPosts ? filteredPosts.map(post => (
            <Link to={`/post/${post._id}`} state={post._id}>
              <div className="post" key={post._id}>
                <img src={post.photo} alt="Post Image" />
                <h3>{post.title}</h3>
                <p>{post.description.length >= 85 ? `${post.description.substring(0, 80)}...` : post.description}</p>
              </div>
            </Link>
          )) : <h1>Loading</h1>}
        </div>
      </section>
    </div>
  )
}
