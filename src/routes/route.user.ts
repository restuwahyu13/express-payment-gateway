import express, { Router, Request, Response } from 'express'
import { userController } from '../controllers/users'
import { fileUpload } from '../utils/util.upload'

const router: Router = express.Router()

router.get('/', (req: Request, res: Response): Response<any> => res.send('Typescript is Running'))
router.post('/user/register', fileUpload.fields([{ name: 'photo' }]), userController.register)
router.post('/user/login', userController.login)
router.get('/user/activation/:id', userController.activation)
router.post('/user/resend', userController.resend)

export default router
