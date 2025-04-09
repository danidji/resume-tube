import { TPromptMessage } from '../types/ai-model.types'

export interface IPromptProvider {
  send(prompt: TPromptMessage[]): Promise<string>
}
