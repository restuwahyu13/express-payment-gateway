import express, { Router } from 'express'
import { saldoController } from '../controllers/saldo'
import { paramsValiator, saldoValidator } from '../utils/util.validator'
import { authJwt } from '../middlewares/middleware.auth'
import { roleJwt } from '../middlewares/middleware.role'

const router: Router = express.Router()

router.post('/user/saldo', [authJwt(), ...saldoValidator()], saldoController.createSaldo)
router.get('/user/saldo', roleJwt(), saldoController.resultsSaldo)
router.get('/user/saldo/:id', [authJwt(), ...paramsValiator()], saldoController.resultSaldo)
router.delete('/user/saldo/:id', [roleJwt(), ...paramsValiator()], saldoController.deleteSaldo)
router.put('/user/saldo/:id', [roleJwt(), ...paramsValiator(), ...saldoValidator()], saldoController.updateSaldo)

export default router
