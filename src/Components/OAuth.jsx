import React from 'react'
import {FcGoogle} from 'react-icons/fc';
import { toast } from 'react-toastify';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router';


export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleclick(){
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth,provider);
      const user = result.user;
      //check if the user is  in the database
      const docRef = doc(db, "users","uid")
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()){
        await setDoc(docRef,{
          name : user.displayName,
          email: user.email,
          timestamp :serverTimestamp(),
        })
      }
      navigate('/');

    } catch (error) {
      toast.error("could not authorize with google");
      console.log(error);
    }
  }
  return (
   <button type="button" onClick={onGoogleclick} className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-md active:shadow-md transition duration-150 ease-in-out rounded'>
   < FcGoogle className='bg-white text-2xl mr-2 rounded-full'  />
    Continue with Google
   </button>
  )
}
