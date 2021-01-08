import express, { Router } from 'express'
import { transferController } from '../controllers/transfers'
import { paramsValiator, transferValidator } from '../utils/util.validator'
import { authJwt } from '../middlewares/middleware.auth'
import { roleJwt } from '../middlewares/middleware.role'

const router: Router = express.Router()

router.post('/transfer', [authJwt(), ...transferValidator()], transferController.createTransfer)
router.get('/transfer', roleJwt(), transferController.resultsTransfer)
router.get('/transfer/:id', [authJwt(), ...paramsValiator()], transferController.resultTransfer)
router.delete('/transfer/:id', [roleJwt(), ...paramsValiator()], transferController.deleteTransfer)
router.put('/transfer/:id', [roleJwt(), ...paramsValiator(), ...transferValidator()], transferController.updateTransfer)

export default router
