import express, { Router } from 'express'
import { topupController } from '../controllers/topups'
import { paramsValiator, topupValidator } from '../utils/util.validator'

const router: Router = express.Router()

router.post('/topup', topupValidator(), topupController.createTopup)
router.get('/topup', topupController.resultsTopup)
router.get('/topup/:id', paramsValiator(), topupController.resultTopup)
router.delete('/topup/:id', paramsValiator(), topupController.deleteTopup)
router.put('/topup/:id', [...paramsValiator(), ...topupValidator()], topupController.updateTopup)

export default router
