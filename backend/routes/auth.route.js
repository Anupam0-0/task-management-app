const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getAllUsers,
} = require("../controllers/auth.controller");
const { protect, admin } = require("../middlewares/auth.middlware");
const upload = require("../middlewares/upload.middlware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/all", protect, getAllUsers);           // get all users
router.get("/profile", protect, getUserProfile);    // get user profile
router.put("/profile", protect, updateUserProfile); // update user profile
router.delete("/delete", protect, deleteUser);      // delete user

router.post("/update-image", upload.single("image"), async (req, res) => {
    if(!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
})


module.exports = router;


