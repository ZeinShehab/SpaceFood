import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../helper/helper';
import '../styles/PostList.css'
import{Link} from 'react-router-dom'
function PostList() {
    const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData.data);
        console.log(postsData)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className='post-list'>
      {posts? posts.map((post) => (
        <div className="post">
          <img src={post.photo}/>
          <h2>{post.title}</h2>
          <div>posted by: {post.owner}</div>
          <div>Description: {post.description && post.description}</div>
        </div>
      )):<h1>Loading Posts</h1>}
    </div>

  );
}

export default PostList;
