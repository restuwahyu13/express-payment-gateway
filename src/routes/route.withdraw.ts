import express, { Router } from 'express'
import { withdrawController } from '../controllers/withdraw'
import { paramsValiator, withdrawValidator } from '../utils/util.validator'

const router: Router = express.Router()

router.post('/withdraw', withdrawValidator(), withdrawController.createWithdraw)
router.get('/withdraw', withdrawController.resultsWithdraw)
router.get('/withdraw/:id', paramsValiator(), withdrawController.resultWithdraw)
router.delete('/withdraw/:id', paramsValiator(), withdrawController.deleteWithdraw)
router.put('/withdraw/:id', [...paramsValiator(), ...withdrawValidator()], withdrawController.updateWithdraw)

export default router
