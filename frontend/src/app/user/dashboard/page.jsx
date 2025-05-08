"use client";

import { useUser } from '@/context/userContext';
import Link from 'next/link';
import React from 'react'

const page = () => {

  const user = useUser()

  return (
    <div>
      users dashboard
      <br />
      {JSON.stringify(user)}
      <br />
      <Link href='/admin/dashboard'>ADMIN</Link>
    </div>
    
  )
}

export default page