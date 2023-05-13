import React, { useEffect, useState } from "react";
import useFetch from "../hooks/fetch.hook";
import axios from "axios";
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function ViewPosts() {
    const [recipes, setRecipes] = useState()
    const [{ isLoading, apiData }] = useFetch()
    const { params } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const username = params
                if (username) {
                    const recipes = await axios.get(`/api/user/${username}/getPosts`)
                    setRecipes(recipes.data)
                }
            } catch (error) {
                console.log(error.response.data.error);
                setRecipes([]);
            }
        }
        fetchRecipes();
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
                        <Link to="/" onClick={userLogout}>Logout</Link>
                    </li>
                </div>
            </nav>

            <div className="post-grid">
                <div className="page-title">My Recipes</div>
                {recipes ? recipes.length == 0 ? <p className="no-results">No Recipes</p>: recipes.map(post => (
                    <Link to={`/post/${post._id}`} state={post._id}>
                        <div className="post" key={post._id}>
                            <img className = 'bookmark-posts' src={post.photo} alt="Post Image" />
                            <h3>{post.title}</h3>
                            <p>{post.description.length >= 85 ? `${post.description.substring(0, 80)}...` : post.description}</p>
                        </div>
                    </Link>
                )) : <div className="Loading">Loading</div>}
            </div>
        </div>
    );
}