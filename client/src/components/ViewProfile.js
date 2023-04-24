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

  useEffect(() => {
    async function fetchData() {
      try {
        const username = params
        const userData = await getUser({username});
        if(userData){
            setUser(userData.data);
        }else{
            <h1>Loading...</h1>
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  if(!user){
    return <h1>Loading...</h1>
  }
  return (
    <div className="user-profile">
      <div className='user-profile-body'>
        <div className='profile'>User Profile</div>
        <div className='user-image'> <img src={user.profile} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" /></div>
        <table>
          <tbody>
          <tr>
            <td colSpan={2}><input style={{width: '100%', height: '50px'}} disabled value={"User Name: "+user.username +"\n"}></input></td>
          </tr>
          <tr>
            <td>
              <input style={{height: '50px'}} disabled value={"First Name: "+user.firstName}></input>
            </td>
            <td>
              <input style={{height: '50px'}} disabled value={"Last Name: "+user.lastName}></input>
            </td>
          </tr>
          <tr>
            <td>
              <input style={{height: '50px'}} disabled value={user.email}></input>
            </td>
            <td>
            <input style={{height: '50px'}} disabled value={"Role: "+user.role}></input>
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
