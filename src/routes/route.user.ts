import express, { Router, Request, Response } from 'express'
import { userController } from '../controllers/users'
import { fileUpload } from '../utils/util.upload'

const router: Router = express.Router()

router.get('/', (req: Request, res: Response): Response<any> => res.send('Typescript is Running'))
router.post('/user/register', fileUpload.fields([{ name: 'photo' }]), userController.register)
router.post('/user/login', userController.login)
router.get('/user/activation/:token', userController.activation)
router.post('/user/resend-token', userController.resend)
router.post('/user/forgot-password', userController.forgot)
router.post('/user/reset-password/:token', userController.reset)

export default router
