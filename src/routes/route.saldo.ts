import express, { Router } from 'express'
import { saldoController } from '../controllers/saldo'

const router: Router = express.Router()

router.post('/saldo', saldoController.createSaldo)
router.get('/saldo', saldoController.resultsSaldo)
router.get('/saldo/:id', saldoController.resultSaldo)
router.delete('/saldo/:id', saldoController.deleteSaldo)
router.put('/saldo/:id', saldoController.updateSaldo)

export default router
