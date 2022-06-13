import express, { json } from 'express'
import cors from 'cors'
import { router } from './routes'
import { handleBodyError } from './helpers/handleBodyError'

import dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const server = express()

  server.use(cors())
  server.use(json())
  server.use(router)
  server.use(handleBodyError)

  server.listen(Number(process.env.APP_PORT) || 3333, '0.0.0.0', () => {
    console.log(`🚀 Server listening on: http://localhost:3333`)
  })
}

bootstrap()
