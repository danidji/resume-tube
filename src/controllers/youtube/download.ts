import { FastifyRequest, FastifyReply } from 'fastify'
import { youtubeService } from '@/services/media/youtube.service'
import { TDownloadRequest } from '@/models'

export async function download(
  request: FastifyRequest<{ Body: TDownloadRequest }>,
  reply: FastifyReply
): Promise<void> {
  const { url } = request.body

  if (!url) {
    reply.status(400).send({
      success: false,
      error: "L'URL est requise",
    })
    return
  }

  try {
    const result = await youtubeService.downloadAudio(url)

    if (!result.success) {
      reply.status(400).send({
        success: false,
        error: result.error,
      })
      return
    }

    reply.send({
      success: true,
      message: 'Téléchargement réussi',
      filename: result.filename,
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error:
        error instanceof Error ? error.message : 'Une erreur est survenue lors du téléchargement',
    })
  }
}

export default download
