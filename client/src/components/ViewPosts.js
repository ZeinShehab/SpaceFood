import React, { useEffect, useState, useRef } from "react";
import useFetch from "../hooks/fetch.hook";
import axios from "axios";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'
import ConfirmDelete from "./ConfirmDelete";
import Popup from 'reactjs-popup';
import { AiFillEdit } from 'react-icons/ai';
import {MdDeleteForever} from 'react-icons/md'

export default function ViewPosts() {
    const [recipes, setRecipes] = useState()
    const [{ isLoading, apiData }] = useFetch()
    const [deletedPost, setDeletedPosts] = useState()
    const { params } = useParams();
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate()
    const [PostToDelete, setPostToDelete] = useState()
    const [open,setOpen] = useState()
    useEffect(() => {
        async function fetchRecipes() {
            try {
                const username = params
                if (username) {
                    const recipes = await axios.get(`/api/user/${username}/getPosts`)
                    setRecipes(recipes.data);
                }
            } catch (error) {
                console.log(error.response.data.error);
                setRecipes([]);
            }
        }
        fetchRecipes();
    }, [apiData]);

    useEffect(() => {
        async function displayRecipes(id) {
            try {
                setRecipes(recipes.filter((p) => p._id !== id));
            }
            catch (error) {
                console.log(error)
            }
        }
        displayRecipes(deletedPost)
    }, [deletedPost]);
    

    const handleDeletePost = async (postId) => {
        try {
            const res = await axios.delete(`/api/DeletePost/${postId}`);
            if (res.status === 200) {
                setDeletedPosts(postId)
                toast.promise(res, {
                    loading: 'Deleting Post...',
                    success: 'Post deleted successfully',
                    error: 'Error has occured. Please try again later.'
                })
            } else {
                throw new Error("Failed to delete your post");
            }
        } catch (error) {
            console.log(error);
        }
    };
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
                <div className="page-title">{apiData && (apiData.username == params) ? "My Recipes" : "Recipes by " + params}</div>
                {recipes ? recipes.length == 0 ? <p className="no-results">No Recipes</p> : recipes.map(post => (
                    <Link to={`/post/${post._id}`} state={post._id} onClick={(event) => {
                    }}>
                        
                        <div className="post" key={post._id}>
                            <img className='bookmark-posts' src={post.photo} alt="Post Image" />
                            <h3>{post.title}</h3>
                            <p>{post.description.length >= 85 ? `${post.description.substring(0, 80)}...` : post.description}</p>
                            {apiData && (apiData.username == params)?
                            
                            <div className="flex">
                            <Popup 
                                trigger={
                                    <div>
                                        <button className='delete-button' onClick={(event)=>{event.preventDefault()}}><MdDeleteForever size={40}/></button>
                                    </div>
                                }
                                contentStyle={{ width: '230px' }}
                                className="popup-wrapper" 
                                position="right center" onOpen={(openPopup) => setOpen(openPopup)} >
                                
                                <div className='flex gap-1 flex-nowrap'>
                                    <div className="confirm-text">Confirm delete?</div>
                                    <button className="confirm-delete" onClick={ () => handleDeletePost(post._id)}>CONFIRM</button>
                                </div>
                            </Popup>
                            {/* <button className="delete-btn" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setPostToDelete(post._id);setModalOpen(true) }}>🗑</button> */}
                            {/* {modalOpen &&<ConfirmDelete onClick={(event)=>{event.preventDefault();event.stopPropagation();}} setOpenModal={setModalOpen} handleDelete= {handleDeletePost} PostToDelete={PostToDelete}/>} */}
                            <div className='edit-button' onClick={(event)=>event.preventDefault()}>
                                    <Link to={`/EditPost/${post._id}`}><AiFillEdit size={40}/></Link>
                            </div>
                            </div> :<p></p>}
                        </div>
                    </Link>
                )) : <div className="Loading">Loading</div>}
            </div>
        </div>
    );
}