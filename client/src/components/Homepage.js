import React from 'react'
import { Link, useNavigate} from 'react-router-dom'
import '../styles/Homepage.css'
import useFetch from '../hooks/fetch.hook'
import PostList from './PostList'
export default function Homepage(){
    const navigate = useNavigate()
    const [{apiData}] =useFetch()
    function userLogout(){
        localStorage.removeItem('token');
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
        <li style={{ display: apiData?.role === "Chef" ? "block" : "none" }}>
          <Link to="/Post">Post a recipe</Link>
        </li>

      </ul>
    </nav>
    <PostList></PostList>
    </div>
            
    )
  }
  