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
  return (
    <div className="user-profile">
      <div className='user-profile-body'>
      <div className='flex align-items'><button onClick={goBack} className='text-red-500 text-7xl' >←</button> </div>

        <div className='profile'>  User Profile</div>
        <div className='user-image'> <img src={user.profile || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" /></div>
        <table>
          <tbody>
          <tr>
            <td><input style={{height: '50px'}} disabled value={"Username: "+user.username +"\n"}></input></td>
            <td>
            <input style={{height: '50px'}} disabled value={"Role: "+ user.role}></input>
            </td>
          </tr>
          <tr>
            <td>
              <input style={{height: '50px'}} disabled value={ (user.firstName != null) ? user.firstName : "n/a"}></input>
            </td>
            <td>
              <input style={{height: '50px'}} disabled value={(user.lastName != null) ? user.lastName : "n/a"}></input>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <input style={{width: '100%', height: '50px'}} disabled value={user.email}></input>
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
  );
}
