import {LayoutDashboard, SquarePlus, ClipboardCheck, Users, LogOut} from "lucide-react";

export const SIDE_MENU_DATA = [
    {
        id : 1,
        title : "Dashboard",
        icon : <LayoutDashboard  />,
        path : "/admin/dashboard",
    },
    {
        id : 2,
        title : "Create Task",
        icon : <SquarePlus />,
        path : "/admin/dashboard/create-task",
    },
    {
        id : 3,
        title : "Manage Task",
        icon : <ClipboardCheck />,
        path : "/admin/dashboard/tasks",
    },
    {
        id : 4,
        title : "Manage Team",
        icon : <Users />,
        path : "/admin/dashboard/team",
    },
    {
        id : 4,
        title : "Settings" ,
        icon : <LogOut/>,
        path : "Logout",

    }
]


export const SIDE_MENU_USER_DATA = [
    {
        id : 1,
        title : "Dashboard",
        icon : "dashboard",
        path : "/user/dashboard",
    },
    {
        id : 2,
        title : "My Tasks",
        icon : "task",
        path : "/user/task",
    },
    {
        id : 3,
        title : "Mnanage Task",
        icon : "list",
        path : "/user/logout",
    },
]

export const PRIRORITY_DATA = [
    {
        label : "Low",
        color : "bg-green-500",
        value : "low",
    },
    {
        title : "Medium",
        color : "bg-yellow-500",
        value : "medium",
    },
    {
        title : "High",
        color : "bg-red-500",
        value : "high",
    },
]

export const STATUS_DATA = [
    {
        label : "Pending",
        value : "pending",
    },
    {
        label : "In Progress",
        value : "in-progress",
    },
    {
        label : "Completed",
        value : "completed",
    },
]


