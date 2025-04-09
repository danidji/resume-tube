import { EDeepSeekModel, EOpenAIModel, EProviderType, TModelAI } from '@/models'

export const modelToProviderMap: Record<TModelAI, EProviderType> = {
  // OpenAI Models
  [EOpenAIModel.GPT4o]: EProviderType.OPEN_AI,
  [EOpenAIModel.GPT35]: EProviderType.OPEN_AI,
  [EOpenAIModel.GPT4oMini]: EProviderType.OPEN_AI,
  // DeepSeek Models
  [EDeepSeekModel.CHAT]: EProviderType.DEEPSEEK,
  [EDeepSeekModel.REASONER]: EProviderType.DEEPSEEK,
}
