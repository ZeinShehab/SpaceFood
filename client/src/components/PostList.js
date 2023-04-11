import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../helper/helper';
import '../styles/PostList.css'
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
  console.log(posts)
  return (
    <div className='post-list'>
      {posts? posts.map((post) => (
        <div className="post">
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <p>posted by: {post.owner}</p>
          <p>Description: {post.description && post.description}</p>
        </div>
      )):<h1>Loading Posts</h1>}
    </div>

  );
}

export default PostList;
