import OpenAI from 'openai'
import { Config } from '@/utils/config'
import { EOpenAIModel, TCompletionConfig, TPromptMessage } from '@/models'

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
    model: EOpenAIModel = EOpenAIModel.GPT35,
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
}

export const openAIService = new OpenAIService()
