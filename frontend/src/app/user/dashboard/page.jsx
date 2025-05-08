"use client";

import { useUserAuth } from '@/hooks/useUserAuth'
import React from 'react'

const page = () => {

  useUserAuth(); // Custom hook to check user authentication

  return (
    <div>users dashboard</div>
  )
}

export default page