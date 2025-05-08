"use client";

import { useEffect, useContext } from 'react';
import { redirect } from 'next/navigation'
import { useUser } from '@/context/userContext';

export const useUserAuth = () => {

    const { user, loading, clearUser } = useUser(); // Assuming you have a UserContext to manage user state

    useEffect(() => {
        if (loading) return; // If loading, do not check user auth
        if (user) return; // If user is already fetched, do not fetch again

        if (!user) {
            clearUser(); // Clear user if not authenticated
            redirect('/login'); // Redirect to login page
        }

    }, [ user, loading , clearUser, redirect]); // Add clearUser and redirect to dependencies

}