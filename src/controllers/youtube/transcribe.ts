import { FastifyRequest, FastifyReply } from 'fastify'
import { youtubeService } from '@/services/media/youtube.service'
import { whisperService } from '@/services/ai/whisper.service'
import { EUseWhisper, TTranscribeRequest } from '@/models'

async function transcribe(
  request: FastifyRequest<{ Body: TTranscribeRequest }>,
  reply: FastifyReply
): Promise<void> {
  const { url, from = EUseWhisper.LOCAL } = request.body

  if (!url) {
    reply.status(400).send({
      success: false,
      error: "L'URL est requise",
    })
    return
  }

  try {
    const downloadResult = await youtubeService.downloadAudio(url)

    if (!downloadResult.success || !downloadResult.filename) {
      reply.status(400).send({
        success: false,
        error: downloadResult.error,
      })
      return
    }

    const filePath = `public/files/${downloadResult.filename}`
    const transcriptionResult =
      from === EUseWhisper.API
        ? await whisperService.transcribeWithAPI(filePath)
        : await whisperService.transcribeLocal(filePath)

    const deleteResult = youtubeService.deleteAudio(downloadResult.filename)

    if (!deleteResult.success) {
      console.error(`Erreur lors de la suppression du fichier: ${deleteResult.error}`)
    }

    if ('error' in transcriptionResult) {
      reply.status(400).send({
        success: false,
        error: transcriptionResult.error,
      })
      return
    }

    reply.send({
      success: true,
      transcription: transcriptionResult.text,
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error:
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la transcription',
    })
  }
}

export default transcribe
