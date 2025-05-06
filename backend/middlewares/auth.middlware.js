const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        // Check if the request has a token in the cookies or in the authorization header
        let token = (req.cookies && req.cookies.token) || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        console.log("User found: ", req.user);
        next();
    } catch (error) {
        console.log("Error in authMiddleware: ", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}


// Middleware to check if the user is an admin
const adminOnly = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        console.log("User is admin: ", req.user);
        next();
    } else {
        res.status(401).json({ message: "Access denied, admin only" });
        console.log("Access denied, admin only: ", req.user);
    }
}

module.exports = { protect, adminOnly };


