import { app } from './app'

const PORT = Number(process.env.PORT) || 3333

app.listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
