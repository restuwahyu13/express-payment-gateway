import express, { Router } from 'express'
import { transferController } from '../controllers/transfers'

const router: Router = express.Router()

router.post('/topup', transferController.createTransfer)
router.get('/topup', transferController.resultsTransfer)
router.get('/topup/:id', transferController.resultTransfer)
router.delete('/topup/:id', transferController.deleteTransfer)
router.put('/topup/:id', transferController.updateTransfer)

export default router
