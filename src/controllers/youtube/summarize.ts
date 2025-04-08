import { FastifyRequest, FastifyReply } from 'fastify'
import { youtubeService } from '@/services/media/youtube.service'
import { whisperService } from '@/services/ai/whisper.service'
import { TSummarizeRequest, EPromptProviderType } from '@/models'

import { PromptManagerService } from '@/services/ai/prompt-manager.service'
import { buildSummaryPrompt } from '@/utils/functions/buildSummaryPrompt'

async function summarize(
  request: FastifyRequest<{ Body: TSummarizeRequest }>,
  reply: FastifyReply
): Promise<void> {
  const { url, model, options } = request.body

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
    const transcriptionResult = await whisperService.transcribeWithAPI(filePath)

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

    const prompt = buildSummaryPrompt(
      transcriptionResult.text,
      EPromptProviderType.OPEN_AI,
      options
    )
    const summary = await PromptManagerService.send(prompt, model)

    reply.send({
      success: true,
      summary,
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue lors du résumé',
    })
  }
}

export default summarize
