import {
  EOpenAIModelLLM,
  EDeepSeekModel,
  EDetailLevel,
  EExpertiseLevel,
  EOpenAIModelTranscribe,
} from '../enums/ai-model.enums'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export type TPromptManager = {
  send: (prompt: TPromptMessage) => Promise<string>
}

export type TPromptMessage = ChatCompletionMessageParam

export type TPromptConfig = {
  messages: TPromptMessage
  temperature?: number
  maxTokens?: number
  model?: EOpenAIModelLLM | EDeepSeekModel
}

export type TCompletionConfig = {
  model: EOpenAIModelLLM | EDeepSeekModel
  temperature?: number
  maxTokens?: number
  messages: TPromptMessage
  frequencyPenalty?: number
  presencePenalty?: number
}

export type TModelAI = EOpenAIModelLLM | EDeepSeekModel

export type TSummaryPromptOptions = {
  detailLevel: EDetailLevel
  outputLanguage: string
  expertiseLevel: EExpertiseLevel
}

export type TSummarizeRequest = {
  url: string
  transcribeModel: EOpenAIModelTranscribe
  model: EOpenAIModelLLM
  options: TSummaryPromptOptions
}
