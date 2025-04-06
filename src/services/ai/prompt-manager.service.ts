import { TPromptMessage, EOpenAIModel, EDeepSeekModel, TModelAI } from '@/models'
import { ProviderFactory, EProviderType } from './providers/provider.factory'

export class PromptManagerService {
  static async send(prompt: TPromptMessage[], model: TModelAI): Promise<string> {
    const providerType = this.getProviderForModel(model)
    const provider = ProviderFactory.createProvider(providerType, model)
    return provider.send(prompt)
  }

  private static modelToProviderMap: Record<TModelAI, EProviderType> = {
    // OpenAI Models
    [EOpenAIModel.GPT4o]: EProviderType.OPENAI,
    [EOpenAIModel.GPT35]: EProviderType.OPENAI,
    [EOpenAIModel.GPT4oMini]: EProviderType.OPENAI,
    // DeepSeek Models
    [EDeepSeekModel.CHAT]: EProviderType.DEEPSEEK,
    [EDeepSeekModel.REASONER]: EProviderType.DEEPSEEK,
  }

  private static getProviderForModel(model: TModelAI): EProviderType {
    const providerType = this.modelToProviderMap[model]
    if (!providerType) {
      throw new Error(`Aucun provider trouvé pour le modèle: ${model}`)
    }
    return providerType
  }
}
