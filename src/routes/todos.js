const router = require("express").Router()
const Todo = require("../models/Todo")
const auth = require("../middleware/authMiddleware")

router.get("/get", auth, async(req,res)=>{

  const todos = await Todo.find({user:req.user.id})
  res.json(todos)

})

router.post("/create", auth, async(req,res)=>{

  const {title,description,completed} = req.body

  const todo = await Todo.create({
    user:req.user.id,
    title,
    description,
    completed
  })

  res.json(todo)

})

router.put("/edit/:id", auth, async(req,res)=>{

  const {title,description,completed} = req.body

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title, description, completed },
    { new: true }
  )

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" })
  }

  res.json(todo)

})

router.delete("/delete/:id", auth, async(req,res)=>{

  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  })

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" })
  }

  res.json({ message: "Deleted" })
})

module.exports = router
