import cors from 'cors'
import express from 'express'
import { pinoHttp } from 'pino-http'
import { serverConfig } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { logger } from './logger.js'

export const app = express()

app.disable('x-powered-by');

app.use(
  cors({
    origin: serverConfig.clientOrigin,
  }),
)
app.use(express.json())
app.use(pinoHttp({ logger }));

app.use('/api', apiRouter)
