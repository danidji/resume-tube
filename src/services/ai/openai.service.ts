import OpenAI from 'openai'
import { Config } from '@/utils/config'
import {
  EOpenAIModelLLM,
  EOpenAIModelTranscribe,
  TCompletionConfig,
  TPromptMessage,
} from '@/models'
import fs from 'fs'

export class OpenAIService {
  private readonly client: OpenAI
  private readonly defaultConfig: Partial<TCompletionConfig> = {
    temperature: 0.5,
    maxTokens: 8192,
    frequencyPenalty: 0,
    presencePenalty: 0,
  }

  constructor() {
    if (!Config.openAiApiKey) {
      throw new Error('La clé API OpenAI est manquante')
    }
    this.client = new OpenAI({ apiKey: Config.openAiApiKey })
  }

  public get openai(): OpenAI {
    return this.client
  }

  async chatCompletion(
    prompt: TPromptMessage[],
    model: EOpenAIModelLLM = EOpenAIModelLLM.GPT35,
    config?: Partial<TCompletionConfig>
  ): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model,
      messages: [...prompt],
      temperature: config?.temperature ?? this.defaultConfig.temperature,
      max_completion_tokens: config?.maxTokens ?? this.defaultConfig.maxTokens,
      frequency_penalty: config?.frequencyPenalty ?? this.defaultConfig.frequencyPenalty,
      presence_penalty: config?.presencePenalty ?? this.defaultConfig.presencePenalty,
    })

    return completion.choices[0]?.message?.content || ''
  }

  public async transcribe(
    audioFilePath: string,
    model: EOpenAIModelTranscribe = EOpenAIModelTranscribe.WHISPER_1
  ): Promise<string> {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Le fichier audio ${audioFilePath} n'existe pas`)
    }

    const transcription = await this.client.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model,
      response_format: 'text',
    })

    return transcription
  }
}

export const openAIService = new OpenAIService()
