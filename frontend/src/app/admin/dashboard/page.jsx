"use client";
import React, { useContext } from 'react'
import { useUserAuth } from '@/hooks/useUserAuth' // Custom hook to check user authentication
import { redirect } from 'next/navigation' // Import redirect from next/navigation
import {  useUser } from '@/context/userContext'

const page = () => {
  
  useUserAuth()
  const {user} = useUser();// Assuming you have a UserContext to manage user state

  return (
    <div>Admin Dashboard
      {/* {JSON.stringify(user)} */}
    </div>
    
  )
}

export default page