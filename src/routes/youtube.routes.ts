import { FastifyInstance } from 'fastify'
import { YoutubeController } from '../controllers/youtube.controller'

export const registerYoutubeRoutes = (server: FastifyInstance): void => {
  server.post('/api/download', YoutubeController.download)
  server.post('/api/transcribe', YoutubeController.transcribe)
}
