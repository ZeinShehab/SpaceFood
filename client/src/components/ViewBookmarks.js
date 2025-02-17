import React, { useEffect, useState } from "react";
import useFetch from "../hooks/fetch.hook";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom'
import { Rating } from '@mui/material';


export default function ViewBookmarks() {
    const [bookmarks, setBookmarks] = useState()
    const [{ isLoading, apiData }] = useFetch()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchBookmarks() {
            try {
                const username = await apiData?.username
                if (username) {
                    const bookmarks = await axios.get(`/api/user/${username}/Bookmarks`)
                    setBookmarks(bookmarks.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchBookmarks();
    }, [apiData]);
    function userLogout() {
        localStorage.removeItem('token')
        navigate('/login')
    }
    function userLogin() {
        navigate('/login')
    }
    return (
        <div>
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

            <div className="post-grid">
                <div className="page-title">BookMarks</div>
                {bookmarks ? bookmarks.length == 0 ? <p className="no-results">No Bookmarks</p>: bookmarks.map(post => (
                    <Link to={`/post/${post._id}`} state={post._id}>
                        <div className="post" key={post._id}>
                            <img className = 'bookmark-posts' src={post.photo} alt="Post Image" />
                            <h3>{post.title}</h3>
                            <div className='post-card-description'>
                  <p>{post.description.length >= 85 ? `${post.description.substring(0, 80)}...` : post.description}
                  </p>
                </div>
                            <div className='post-card-details'>
                                <div className='post-card-details-text'>{post.owner.username}</div>
                                <span className='divider'></span>
                                <div className='post-card-details-text'>{new Date(post.createdAt).toDateString()}</div>
                                <span className='divider'></span>
                                <Rating className='post-card-rating' name="read-only" precision={0.5} value={post.rating} readOnly/>
                            </div>
                        </div>
                    </Link>
                )) : <div className="Loading">Loading</div>}
            </div>
        </div>
    );
}