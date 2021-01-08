import express, { Router } from 'express'
import { saldoController } from '../controllers/saldo'
import { paramsValiator, saldoValidator } from '../utils/util.validator'

const router: Router = express.Router()

router.post('/user/saldo', saldoValidator(), saldoController.createSaldo)
router.get('/user/saldo', saldoController.resultsSaldo)
router.get('/user/saldo/:id', paramsValiator(), saldoController.resultSaldo)
router.delete('/user/saldo/:id', paramsValiator(), saldoController.deleteSaldo)
router.put('/user/saldo/:id', [...paramsValiator(), ...saldoValidator()], saldoController.updateSaldo)

export default router
