import OpenAI from 'openai'
import { Config } from '@/utils/config'

export class OpenAIService {
  private readonly client: OpenAI

  constructor() {
    if (!Config.openAiApiKey) {
      throw new Error('La clé API OpenAI est manquante')
    }
    this.client = new OpenAI({ apiKey: Config.openAiApiKey })
  }

  public get openai(): OpenAI {
    return this.client
  }
}

export const openAIService = new OpenAIService()
