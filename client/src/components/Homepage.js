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
            <nav class="navMenu " style={{float:'right'}}>
            <span className='text-gray-500' style={{padding:'20px'}}><button className='text-purple-500'  onClick={userLogout} to="/">Logout</button></span>
            <span className='text-gray-500'><Link className='text-purple-500' to="/profile">edit profile</Link></span>
            </nav>
            
    )
  }
  