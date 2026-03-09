const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

router.post("/register", async(req,res)=>{

    const {username,email,password} = req.body

    const userExists = await User.findOne({email})

    if(userExists){
        return res.status(400).json({message:"User exists"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const user = await User.create({
        username,
        email,
        password:hashedPassword
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

    const user = await User.findOne({email})

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