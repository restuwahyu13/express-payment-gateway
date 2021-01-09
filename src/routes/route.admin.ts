import express, { Router } from 'express'
import { adminController } from '../controllers/admins'
import { fileUpload } from '../utils/util.upload'
import { adminValidator, paramsValiator } from '../utils/util.validator'
import { roleJwt } from '../middlewares/middleware.role'

const router: Router = express.Router()

router.post('/admin', [...adminValidator(), fileUpload.fields([{ name: 'photo' }])], adminController.createAdmin)
router.get('/admin', roleJwt(), adminController.resultsAdmin)
router.get('/admin/:id', [roleJwt(), ...paramsValiator()], adminController.resultAdmin)
router.delete('/admin/:id', [roleJwt(), ...paramsValiator()], adminController.deleteAdmin)
router.put('/admin/:id', [roleJwt(), ...paramsValiator(), ...adminValidator()], adminController.updateAdmin)

export default router
