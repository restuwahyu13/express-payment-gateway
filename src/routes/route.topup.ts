import express, { Router } from 'express'
import { topupController } from '../controllers/topups'

const router: Router = express.Router()

router.post('/topup', topupController.createTopup)
router.get('/topup', topupController.resultsTopup)
router.get('/topup/:id', topupController.resultTopup)
router.delete('/topup/:id', topupController.deleteTopup)
router.put('/topup/:id', topupController.updateTopup)

export default router
