import { TPromptMessage, EOpenAIModel, EDeepSeekModel } from '@/models'
import { ProviderFactory, EProviderType } from './providers/provider.factory'

export class PromptManagerService {
  static async send(
    prompt: TPromptMessage[],
    providerType: EProviderType,
    model?: EOpenAIModel | EDeepSeekModel
  ): Promise<string> {
    const provider = ProviderFactory.createProvider(providerType, model)
    return provider.send(prompt)
  }
}
