import { EDeepSeekModel, EOpenAIModelLLM, EProviderType, TModelAI } from '@/models'

export const modelToProviderMap: Record<TModelAI, EProviderType> = {
  // OpenAI Models
  [EOpenAIModelLLM.GPT4o]: EProviderType.OPEN_AI,
  [EOpenAIModelLLM.GPT35]: EProviderType.OPEN_AI,
  [EOpenAIModelLLM.GPT4oMini]: EProviderType.OPEN_AI,
  // DeepSeek Models
  [EDeepSeekModel.CHAT]: EProviderType.DEEPSEEK,
  [EDeepSeekModel.REASONER]: EProviderType.DEEPSEEK,
}
