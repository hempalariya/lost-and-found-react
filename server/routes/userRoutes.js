import express from 'express'
import { createUser, getUser, getUsers, loginUser } from '../controllers/userController.js'


const userRouter = express.Router()

//get all users
userRouter.get('/', getUsers)

//create user
userRouter.post('/', createUser)

//get a user
userRouter.get('/:id', getUser)


//login user
userRouter.post('/login', loginUser)
export default userRouter