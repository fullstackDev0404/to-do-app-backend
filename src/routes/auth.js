const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())

router.post("/register", async(req,res)=>{

    const {username,email,password} = req.body
    const trimmedUsername = username?.trim()
    const trimmedEmail = email?.trim()

    if (!trimmedUsername) {
        return res.status(400).json({ message: "Username is required" })
    }
    if (trimmedUsername.length < 2) {
        return res.status(400).json({ message: "Username must be at least 2 characters" })
    }
    if (!trimmedEmail) {
        return res.status(400).json({ message: "Email is required" })
    }
    if (!isValidEmail(trimmedEmail)) {
        return res.status(400).json({ message: "Please provide a valid email address" })
    }
    if (!password || typeof password !== "string") {
        return res.status(400).json({ message: "Password is required" })
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const userExists = await User.findOne({ email: trimmedEmail })

    if(userExists){
        return res.status(400).json({message:"User exists"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const user = await User.create({
        username: trimmedUsername,
        email: trimmedEmail,
        password: hashedPassword
    })

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )

    res.json({token})
})


router.post("/login", async(req,res)=>{

    const {email,password} = req.body
    const trimmedEmail = email?.trim()

    if (!trimmedEmail) {
        return res.status(400).json({ message: "Email is required" })
    }
    if (!isValidEmail(trimmedEmail)) {
        return res.status(400).json({ message: "Please provide a valid email address" })
    }
    if (!password || typeof password !== "string") {
        return res.status(400).json({ message: "Password is required" })
    }

    const user = await User.findOne({ email: trimmedEmail })

    if(!user){
        return res.status(400).json({message:"Invalid credentials"})
    }

    const match = await bcrypt.compare(password,user.password)

    if(!match){
        return res.status(400).json({message:"Invalid credentials"})
    }

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )

    res.json({token})
})

module.exports = router