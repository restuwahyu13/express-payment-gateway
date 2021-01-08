import express, { Router } from 'express'
import { withdrawController } from '../controllers/withdraw'
import { paramsValiator, withdrawValidator } from '../utils/util.validator'
import { authJwt } from '../middlewares/middleware.auth'
import { roleJwt } from '../middlewares/middleware.role'

const router: Router = express.Router()

router.post('/withdraw', [authJwt(), ...withdrawValidator()], withdrawController.createWithdraw)
router.get('/withdraw', roleJwt(), withdrawController.resultsWithdraw)
router.get('/withdraw/:id', [authJwt(), ...paramsValiator()], withdrawController.resultWithdraw)
router.delete('/withdraw/:id', [roleJwt(), ...paramsValiator()], withdrawController.deleteWithdraw)
router.put('/withdraw/:id', [roleJwt(), ...paramsValiator(), ...withdrawValidator()], withdrawController.updateWithdraw)

export default router
