import { Router } from 'express'
import { OffersController } from './controllers/offers.controller'

export const router = Router()

router.get('/', new OffersController().handle)
