import React from "react";
import { Navigate, useParams } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";
import axios from "axios";
import {getPost} from '../helper/helper';

export const AuthorizeUserAsChef = ({ children }) => {
  const [{ apiData }] = useFetch();
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const role = apiData?.role;
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsAuthorized(role === "Chef");
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (apiData?.username) {
      fetchUser();
    }
  }, [apiData]);

  if (!apiData?.username || isLoading) {
    return <h1 className='text-2xl font-bold'>isLoading</h1>;; // or return a loading indicator
  }

  if (isAuthorized) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/"} replace={true} />;
  }
}

export const AuthorizeOwner = ({children}) => {
  const [{ apiData }] = useFetch();
  const {params} = useParams();
  const [post, setPost] = React.useState();
  const [isOwner, setIsOwner] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOwner = async () => {
      const username = apiData?.username;
      const post = await getPost(params);
      const postOwner = post.data.owner.username; 

      try {
        setIsOwner(username == postOwner);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }      
    }

    if (apiData?.username) {
      fetchOwner();
    }
  }, [apiData]);

  if (!apiData?.username || isLoading) {
    return <h1 className='text-2xl font-bold'>isLoading</h1>;; // or return a loading indicator
  }

  if (isOwner) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/"} replace={true} />;
  }
}

