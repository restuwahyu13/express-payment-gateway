import express, { Router } from 'express'
import { transferController } from '../controllers/transfers'
import { paramsValiator, transferValidator } from '../utils/util.validator'

const router: Router = express.Router()

router.post('/transfer', transferValidator(), transferController.createTransfer)
router.get('/transfer', transferController.resultsTransfer)
router.get('/transfer/:id', paramsValiator(), transferController.resultTransfer)
router.delete('/transfer/:id', paramsValiator(), transferController.deleteTransfer)
router.put('/transfer/:id', [...paramsValiator(), ...transferValidator()], transferController.updateTransfer)

export default router
