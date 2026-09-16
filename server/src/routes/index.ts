import { Router } from 'express'
import { authRouter } from './auth.js'
import { healthRouter } from './health.js'
import { marketplaceRouter } from './marketplace.js'

export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/marketplace', marketplaceRouter)
