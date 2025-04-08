import { FastifyRequest, FastifyReply } from 'fastify'
import { youtubeService } from '@/services/media/youtube.service'
import { whisperService } from '@/services/ai/whisper.service'
import {
  EUseWhisper,
  TDownloadRequest,
  TTranscribeRequest,
  TSummarizeRequest,
  EPromptProviderType,
} from '@/models'
import { PromptManagerService } from '@/services/ai/prompt-manager.service'
import { buildSummaryPrompt } from '@/utils/functions/buildSummaryPrompt'

async function download(
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
        : await whisperService.transcribe(filePath)

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

export const YoutubeController = {
  download,
  transcribe,
  summarize,
}
