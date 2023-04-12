import React from "react";
import { Navigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";
import axios from "axios";

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
    return <Navigate to={"/Homepage"} replace={true} />;
  }
};

