import express, { Router } from 'express'
import { topupController } from '../controllers/topups'
import { paramsValiator, topupValidator } from '../utils/util.validator'
import { authJwt } from '../middlewares/middleware.auth'
import { roleJwt } from '../middlewares/middleware.role'

const router: Router = express.Router()

router.post('/topup', [authJwt(), ...topupValidator()], topupController.createTopup)
router.get('/topup', roleJwt(), topupController.resultsTopup)
router.get('/topup/:id', [authJwt(), ...paramsValiator()], topupController.resultTopup)
router.delete('/topup/:id', [roleJwt(), ...paramsValiator()], topupController.deleteTopup)
router.put('/topup/:id', [roleJwt(), ...paramsValiator(), ...topupValidator()], topupController.updateTopup)

export default router
