import { TPromptMessage, TModelAI, EProviderType } from '@/models'
import { ProviderFactory } from './providers/provider.factory'
import { modelToProviderMap } from '@/utils/constants/models.constants'

export class PromptManagerService {
  static async send(prompt: TPromptMessage[], model: TModelAI): Promise<string> {
    const providerType = this.getProviderForModel(model)
    const provider = ProviderFactory.createProvider(providerType, model)
    return provider.send(prompt)
  }

  private static getProviderForModel(model: TModelAI): EProviderType {
    const providerType = modelToProviderMap[model]
    if (!providerType) {
      throw new Error(`Aucun provider trouvé pour le modèle: ${model}`)
    }
    return providerType
  }
}
