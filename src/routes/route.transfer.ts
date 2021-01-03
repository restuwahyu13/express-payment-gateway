import express, { Router } from 'express'
import { transferController } from '../controllers/transfers'

const router: Router = express.Router()

router.post('/transfer', transferController.createTransfer)
router.get('/transfer', transferController.resultsTransfer)
router.get('/transfer/:id', transferController.resultTransfer)
router.delete('/transfer/:id', transferController.deleteTransfer)
router.put('/transfer/:id', transferController.updateTransfer)

export default router
