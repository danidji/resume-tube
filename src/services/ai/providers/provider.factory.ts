import { IPromptProvider } from '@/models/interfaces/prompt.interfaces'
import { OpenAIPromptProvider } from './openai.provider'
import { DeepSeekPromptProvider } from './deepseek.provider'
import { OpenAIService } from '../openai.service'
import { DeepSeekService } from '../deepseek.service'
import { EOpenAIModelLLM, EDeepSeekModel, EProviderType } from '@/models'

export class ProviderFactory {
  private static openAIService = new OpenAIService()
  private static deepseekService = new DeepSeekService()

  static createProvider(
    type: EProviderType,
    model?: EOpenAIModelLLM | EDeepSeekModel
  ): IPromptProvider {
    switch (type) {
      case EProviderType.OPEN_AI:
        return new OpenAIPromptProvider(this.openAIService, model as EOpenAIModelLLM)
      case EProviderType.DEEPSEEK:
        return new DeepSeekPromptProvider(this.deepseekService, model as EDeepSeekModel)
      default:
        throw new Error(`Provider type ${type} not supported`)
    }
  }
}
