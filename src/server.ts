import fastify, { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import { registerYoutubeRoutes } from './routes/youtube.routes'

const server = fastify({
  logger: true,
})

const init = async (): Promise<void> => {
  await server.register(cors, {
    origin: true,
  })

  registerYoutubeRoutes(server)

  server.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    server.log.error(error)
    reply.status(error.statusCode ?? 500).send({
      error: error.message ?? 'An internal error occurred',
    })
  })
}

const start = async (): Promise<void> => {
  try {
    await init()
    await server.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server started on port 3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
