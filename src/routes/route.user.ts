import express, { Router, Request, Response } from 'express'
import { userController } from '../controllers/users'
import { fileUpload } from '../utils/util.upload'
import { registerValidator, loginValidator, emailValidator } from '../utils/util.validator'

const router: Router = express.Router()

router.post('/user/register', [...registerValidator(), fileUpload.fields([{ name: 'photo' }])], userController.register)
router.post('/user/login', loginValidator(), userController.login)
router.get('/user/activation/:token', emailValidator(), userController.activation)
router.post('/user/resend-activation', userController.resend)
router.post('/user/forgot-password', emailValidator(), userController.forgot)
router.post('/user/reset-password/:token', emailValidator(), userController.reset)

export default router
