import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook'; 
import convertToBase64 from '../helper/convert';
import { getUser } from '../helper/helper';

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
      <h1>User Profile</h1>
        <h2>{user.username +"\n"}</h2>
        <h2>{user.firstName}</h2>
        <h2>{user.lastName}</h2>
        <h2>{user.email}</h2>
        <h2>{user.role}</h2>
        <img src={user.profile}/>
    </div>
  );
}
