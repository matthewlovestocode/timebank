import { app } from './app.js'
import { serverConfig } from './config/env.js'

const { port } = serverConfig

app.listen(port, () => {
  console.log(`Timebank API listening on http://localhost:${port}`)
})
