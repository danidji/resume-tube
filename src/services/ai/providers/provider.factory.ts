import { IPromptProvider } from '@/models/interfaces/prompt.interfaces'
import { OpenAIPromptProvider } from './openai.provider'
import { DeepSeekPromptProvider } from './deepseek.provider'
import { OpenAIService } from '../openai.service'
import { DeepSeekService } from '../deepseek.service'
import { EOpenAIModel, EDeepSeekModel } from '@/models'

export enum EProviderType {
  OPENAI = 'openai',
  DEEPSEEK = 'deepseek',
}

export class ProviderFactory {
  private static openAIService = new OpenAIService()
  private static deepseekService = new DeepSeekService()

  static createProvider(
    type: EProviderType,
    model?: EOpenAIModel | EDeepSeekModel
  ): IPromptProvider {
    switch (type) {
      case EProviderType.OPENAI:
        return new OpenAIPromptProvider(this.openAIService, model as EOpenAIModel)
      case EProviderType.DEEPSEEK:
        return new DeepSeekPromptProvider(this.deepseekService, model as EDeepSeekModel)
      default:
        throw new Error(`Provider type ${type} not supported`)
    }
  }
}
