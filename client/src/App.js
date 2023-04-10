import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Container, AppBar, Typography, Grow, Grid } from '@material-ui/core';

/** import all components */
import memories from './images/memories.png';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';

import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import Homepage from './components/Homepage';
import PageNotFound from './components/PageNotFound';


/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'


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
        element : <AuthorizeUser><Homepage></Homepage></AuthorizeUser>
    }
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}
