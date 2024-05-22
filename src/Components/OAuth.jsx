import React from 'react'
import {FcGoogle} from 'react-icons/fc';

export default function OAuth() {
  return (
   <button className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-md active:shadow-md transition duration-150 ease-in-out rounded'>
   < FcGoogle className='bg-white text-2xl mr-2 rounded-full' />
    Continue with Google
   </button>
  )
}
