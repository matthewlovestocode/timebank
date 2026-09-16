import cors from 'cors'
import express from 'express'
import { serverConfig } from './config/env.js'
import { apiRouter } from './routes/index.js'

export const app = express()

app.use(
  cors({
    origin: serverConfig.clientOrigin,
  }),
)
app.use(express.json())
app.use('/api', apiRouter)
