import React, { useEffect, useState } from "react";
import useFetch from "../hooks/fetch.hook";
import axios from "axios";
import { Link } from "react-router-dom";
export default function ViewBookmarks() {
    const [bookmarks, setBookmarks] = useState()
    const [{ isLoading, apiData }] = useFetch()
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
    return (
        <div className="post-grid">
            {bookmarks ? bookmarks.map(post => (
                <Link to={`/post/${post._id}`} state={post._id}>
                    <div className="post" key={post._id}>
                        <img src={post.photo} alt="Post Image" />
                        <h3>{post.title}</h3>
                        <p>{post.description.length >= 85 ? `${post.description.substring(0, 80)}...` : post.description}</p>
                    </div>
                </Link>
            )) : <h1>Loading</h1>}
        </div>

    );
}