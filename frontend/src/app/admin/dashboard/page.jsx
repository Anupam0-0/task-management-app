"use client";
import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "@/hooks/useUserAuth"; // Custom hook to check user authentication
import { redirect } from "next/navigation"; // Import redirect from next/navigation
import { useUser } from "@/context/userContext";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const page = () => {
  useUserAuth();
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  const DashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(null);
    }
  };

  useEffect(() => { 
      DashboardData();
      return () => {};
  }, []);

  return (
    <div className="px-max py-5">
      Admin Dashboard
      {JSON.stringify(dashboardData)}
    </div>
  );
};

export default page;
