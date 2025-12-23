import { app } from "../infrastructure/http/fastify/server"

app.listen({ port: 3000 }, () => {
  console.log('🚀 Server running on http://localhost:3000')
})
