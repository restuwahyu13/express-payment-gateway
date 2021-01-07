import express, { Router } from 'express'
import { withdrawController } from '../controllers/withdraw'

const router: Router = express.Router()

router.post('/withdraw', withdrawController.createWithdraw)
router.get('/withdraw', withdrawController.resultsWithdraw)
router.get('/withdraw/:id', withdrawController.resultWithdraw)
router.delete('/withdraw/:id', withdrawController.deleteWithdraw)
router.put('/withdraw/:id', withdrawController.updateWithdraw)

export default router
