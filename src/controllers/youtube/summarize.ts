import { FastifyRequest, FastifyReply } from 'fastify'
import { youtubeService } from '@/services/media/youtube.service'
import {
  TSummarizeRequest,
  TModelAI,
  TSummaryPromptOptions,
  EOpenAIModelTranscribe,
} from '@/models'
import { PromptManagerService } from '@/services/ai/prompt-manager.service'
import { buildSummaryPrompt } from '@/utils/functions/buildSummaryPrompt'
import { audioService } from '@/services/media/audio.service'
import { modelToProviderMap } from '@/utils/constants/models.constants'
import { openAIService } from '@/services/ai/openai.service'

async function summarize(
  request: FastifyRequest<{ Body: TSummarizeRequest }>,
  reply: FastifyReply
): Promise<void> {
  const { url, model, options, transcribeModel } = request.body

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

    const audioChunks = await audioService.splitAudio(filePath, 600)

    const transcriptions = await Promise.all(
      audioChunks.map((chunk) => transcribeAndCleanChunk(chunk, transcribeModel))
    )

    await audioService.cleanAudioChunks(audioChunks)

    const fullTranscription = transcriptions.join('\n\n')

    cleanOriginalAudio(downloadResult.filename)

    const summary = await generateSummaryFromTranscript(fullTranscription, model, options)

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

async function transcribeAndCleanChunk(
  chunk: string,
  transcribeModel: EOpenAIModelTranscribe
): Promise<string> {
  try {
    const transcription = await openAIService.transcribe(chunk, transcribeModel)

    return transcription
  } catch (error) {
    throw new Error(`Erreur lors de la transcription: ${error}`)
  }
}

function cleanOriginalAudio(filename: string): void {
  const deleteResult = youtubeService.deleteAudio(filename)
  if (!deleteResult.success) {
    console.error(`Erreur lors de la suppression du fichier: ${deleteResult.error}`)
  }
}

async function generateSummaryFromTranscript(
  transcription: string,
  model: TModelAI,
  options: TSummaryPromptOptions
): Promise<string> {
  const prompt = buildSummaryPrompt(transcription, modelToProviderMap[model], options)
  return PromptManagerService.send(prompt, model)
}

export default summarize
