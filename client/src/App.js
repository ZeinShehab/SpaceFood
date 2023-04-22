import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import Homepage from './components/Homepage';
import PageNotFound from './components/PageNotFound';
import Post from './components/Post';

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'
import Post from './components/Post';
import { AuthorizeUserAsChef } from './middleware/authChef';
import PostList from './components/PostList';

/** root routes */
const router = createBrowserRouter([
    {
        path : '/',
        element : <Username></Username>
    },
    {
        path : '/register',
        element : <Register></Register>
    },
    {
        path : '/password',
        element : <ProtectRoute><Password /></ProtectRoute>
    },
    {
        path : '/profile',
        element : <AuthorizeUser><Profile /></AuthorizeUser>
    },
    {
        path : '/recovery',
        element : <Recovery></Recovery>
    },
    {
        path : '/reset',
        element : <Reset></Reset>
    },
    {
        path : '*',
        element : <PageNotFound></PageNotFound>
    },
    {
        path : '/Homepage',
        element : <Homepage></Homepage>
    },
    {
        path : '/post/:id',
        element : <Post></Post>
        //element : <AuthorizeUser><Homepage></Homepage></AuthorizeUser>
    },
    {
        path : '/Post',
        element: <AuthorizeUser><AuthorizeUserAsChef><Post></Post></AuthorizeUserAsChef></AuthorizeUser>
    }
    // ,
    // {
    //     path: '/AllPosts',
    //     element: <AuthorizeUser><PostList></PostList></AuthorizeUser>
    // }
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}
