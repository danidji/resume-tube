import OpenAI from 'openai'
import { Config } from '@/utils/config'
import { EDeepSeekModel, TCompletionConfig, TPromptMessage } from '@/models'

export class DeepSeekService {
  private readonly client: OpenAI
  private readonly defaultConfig: Partial<TCompletionConfig> = {
    temperature: 0.7,
    maxTokens: 2000,
    frequencyPenalty: 0,
    presencePenalty: 0,
  }

  constructor() {
    if (!Config.deepseekApiKey) {
      throw new Error('La clé API DeepSeek est manquante')
    }
    this.client = new OpenAI({
      apiKey: Config.deepseekApiKey,
      baseURL: 'https://api.deepseek.com/v1',
    })
  }

  async chatCompletion(
    prompt: TPromptMessage,
    model: EDeepSeekModel = EDeepSeekModel.Chat,
    config?: Partial<TCompletionConfig>
  ): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model,
      messages: [prompt],
      temperature: config?.temperature ?? this.defaultConfig.temperature,
      max_completion_tokens: config?.maxTokens ?? this.defaultConfig.maxTokens,
      frequency_penalty: config?.frequencyPenalty ?? this.defaultConfig.frequencyPenalty,
      presence_penalty: config?.presencePenalty ?? this.defaultConfig.presencePenalty,
    })

    return completion.choices[0]?.message?.content || ''
  }
}

export const deepseekService = new DeepSeekService()
