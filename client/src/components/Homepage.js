import React from 'react'
import { Link, useNavigate} from 'react-router-dom'
import '../styles/Homepage.css'

export default function Homepage() {
  const navigate = useNavigate()

  function userLogout() {
    localStorage.removeItem('token')
    navigate('/')
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
        </ul>
      </nav>

      <section className="recent-posts">
        <div className="post-section">
        <h2 className="TempHeader">Recent Posts</h2>
        
        </div>
        <div className="post-grid">
          <Link to="/post/1">
            <div className="post">
              <img src="https://via.placeholder.com/300x200" alt="Post Image" />
              <h3>Delicious Pizza Recipe</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut dolor eu nisl dictum fringilla. Etiam viverra metus a nisi bibendum, vel consequat enim ullamcorper.</p>
            </div>
          </Link>
          <Link to="/post/2">
            <div className="post">
              <img src="https://via.placeholder.com/300x200" alt="Post Image" />
              <h3>Tasty Sushi Rolls</h3>
              <p>Nullam consequat, sapien at lobortis auctor, nulla elit ullamcorper lacus, sit amet venenatis nisl neque nec mi. Nullam eget nisi at enim luctus congue id ac ante.</p>
            </div>
          </Link>
          <Link to="/post/2">
            <div className="post">
              <img src="https://via.placeholder.com/300x200" alt="Post Image" />
              <h3>Tasty Sushi Rolls</h3>
              <p>Nullam consequat, sapien at lobortis auctor, nulla elit ullamcorper lacus, sit amet venenatis nisl neque nec mi. Nullam eget nisi at enim luctus congue id ac ante.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}