import React from 'react'
import { Navigate, Outlet } from 'react-router';
import {useAuthstatus} from '../hooks/useAuthstatus';
import Spinner from './Spinner';

export default function PrivateRoute() {
    const {loggedIn, checkingStatus} = useAuthstatus();
    if(checkingStatus){
        return <Spinner/>
    }
  return loggedIn ? <Outlet/> : <Navigate to = "/sign-in"/>;
}
