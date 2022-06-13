import { Request, Response } from 'express'
import { OffersService } from '../services/offers.service'

const service = new OffersService()

export class OffersController {
  async handle(request: Request, response: Response) {
    try {
      const result = await service.getOffers()

      if (result instanceof Error) {
        return response.status(400).json({ message: result.message })
      }

      return response.json(result)
    } catch (error: any) {
      response.status(400).json({ message: error.message })
    }
  }
}
