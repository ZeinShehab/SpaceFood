import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook'; 
import convertToBase64 from '../helper/convert';
import { getUser } from '../helper/helper';
import '../styles/ViewProfile.css'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import { updateUser } from '../helper/helper'
import {BiFork} from 'react-icons/bi';


import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css'

export default function ViewProfile() {
  const [{ apiData }] = useFetch();
  const [user, setUser ] = useState();
  const { params } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const username = params
        if (username) {
            const userData = await getUser({username});
            setUser(userData.data);
          }
        } catch (error) {
          console.log(error.response.data.error);
        }
    }
    fetchData();
  }, []);

  if(!user){
    return <div>Loading...</div>
  }
  function goBack(){
    navigate(-1);
  }
  function userLogout() {
    localStorage.removeItem('token')
    navigate('/login')
}
function userLogin() {
    navigate('/login')
}
  return (
    <div className='grid'>
         <nav className='homepage-header'>
                <div className="logo">
                    <Link to="/">SpaceFood</Link>
                </div>
                {apiData && apiData.email?
                    <div className="nav-links">
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/login" onClick={userLogout}>Logout</Link>
                    </li>
                    </div> :
                    <div className="nav-links">
                        <li>
                        <Link to="/login" onClick={userLogin}>Login</Link>
                        </li>
                    </div>
                    }
            </nav>
      <div className="user-profile">
     
      <div className='user-profile-body'>
      <div className='flex align-items'><button onClick={goBack} className='text-orange-500 text-7xl' >←</button> </div>

        <div className='profile'>  {user && user.username}</div>
        {user && user.role == "Chef" && <Link to={`/viewPosts/${user.username}`}>
                <div className='viewprofilebookmark'>
                    Recipes
                    <BiFork className={`${styles.profilebookmarkicon} ${extend.profilebookmarkicon}`}/>
                </div> 
        </Link>}
        
        <div style={{paddingBottom: '20px'}}></div>
        <div className='user-image'> <img src={user.profile || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" /></div>
        <table>
          <tbody>
          <tr>
            <td><input className='viewprofiletextbox' disabled value={"Username: "+user.username +"\n"}></input></td>
            <td>
            <input className='viewprofiletextbox' disabled value={"Role: "+ user.role}></input>
            </td>
          </tr>
          <tr>
            <td>
              <input className='viewprofiletextbox' disabled value={ (user.firstName != "") ? user.firstName : "n/a"}></input>
            </td>
            <td>
              <input className='viewprofiletextbox' disabled value={(user.lastName != "") ? user.lastName : "n/a"}></input>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <input className='viewprofiletextbox' disabled value={user.email}></input>
            </td>
          </tr>
          </tbody>
        </table>
        {/* <input disabled value={user.username +"\n"}></input>
        <input disabled value={user.firstName}></input>
        <input disabled value={user.lastName}></input>
        <input disabled value={user.email}></input>
        <input disabled value={user.role}></input> */}
      </div>
    </div>
    </div>
    
  );
}
