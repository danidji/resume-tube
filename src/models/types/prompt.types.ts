import { EOpenAIModel, EDeepSeekModel } from '../enums/prompt.enums'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export type TPromptManager = {
  send: (prompt: TPromptMessage) => Promise<string>
}

export type TPromptMessage = ChatCompletionMessageParam

export type TPromptConfig = {
  messages: TPromptMessage
  temperature?: number
  maxTokens?: number
  model?: EOpenAIModel | EDeepSeekModel
}

export type TCompletionConfig = {
  model: EOpenAIModel | EDeepSeekModel
  temperature?: number
  maxTokens?: number
  messages: TPromptMessage
  frequencyPenalty?: number
  presencePenalty?: number
}

export type TModelAI = EOpenAIModel | EDeepSeekModel
