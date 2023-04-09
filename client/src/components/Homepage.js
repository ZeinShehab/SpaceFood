import React from 'react'
import { Link, useNavigate} from 'react-router-dom'
import '../styles/Homepage.css'
export default function Homepage(){
    const navigate = useNavigate()
    function userLogout(){
        localStorage.removeItem('token');
        navigate('/')
      }
    return (
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
            
    )
  }
  