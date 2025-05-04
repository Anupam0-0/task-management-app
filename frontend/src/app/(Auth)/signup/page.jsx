"use client";
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {

  const getTicket = () => {
    localStorage.setItem('ticket', '1234')
    console.log('Ticket generated')
  }

  const submitTicket = () => {
    localStorage.removeItem('ticket')
    console.log('Ticket submitted')
    console.log('Ticket:', localStorage.getItem('ticket'))
  }

  useEffect(() => {
    const ticket = localStorage.getItem('ticket')
    if (ticket) {
      redirect('/')
    } else {
      console.log('Ticket:', ticket)
    }
  }, [])

  return (
    <div className='p-10 flex flex-col gap-10'> 
    <div className=' font-black'> Collect Ticket from here:</div>
    <button onClick={getTicket} className='bg-green-600 size-20 text-neutral-50 active:scale-95' >
      Get TIcket
    </button>

    <button onClick={submitTicket} className='bg-red-600 size-20 text-neutral-50 active:scale-95'>
      Submit Ticket
    </button>
    </div>
  )
}

export default page