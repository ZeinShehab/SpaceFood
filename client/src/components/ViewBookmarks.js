import React, { useEffect, useState } from "react";
import useFetch from "../hooks/fetch.hook";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom'

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
        navigate('/')
    }
    return (
        <div>
            <nav className='homepage-header'>
                <div className="logo">
                    <Link to="/Homepage">SpaceFood</Link>
                </div>
                <div className="nav-links">
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/Post" >Post a recipe</Link>
                    </li>
                    <li>
                        <Link to="/" onClick={userLogout}>Logout</Link>
                    </li>
                    <li>
                        <Link to="/Bookmarks">Bookmarks</Link>
                    </li>
                </div>
            </nav>

            <div className="post-grid">
                {bookmarks ? bookmarks.map(post => (
                    <Link to={`/post/${post._id}`} state={post._id}>
                        <div className="post" key={post._id}>
                            <img className = 'bookmark-posts' src={post.photo} alt="Post Image" />
                            <h3>{post.title}</h3>
                            <p>{post.description.length >= 85 ? `${post.description.substring(0, 80)}...` : post.description}</p>
                        </div>
                    </Link>
                )) : <h1 style = {{padding: '100px'} }>Loading</h1>}
            </div>
        </div>
    );
}