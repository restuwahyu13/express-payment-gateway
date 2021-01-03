import express, { Router } from 'express'
import { saldoController } from '../controllers/saldo'

const router: Router = express.Router()

router.post('/user/saldo', saldoController.createSaldo)
router.get('/user/saldo', saldoController.resultsSaldo)
router.get('/user/saldo/:id', saldoController.resultSaldo)
router.delete('/user/saldo/:id', saldoController.deleteSaldo)
router.put('/user/saldo/:id', saldoController.updateSaldo)

export default router
