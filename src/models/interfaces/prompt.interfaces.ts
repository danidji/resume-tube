import { TPromptMessage } from '../types/prompt.types'

export interface IPromptProvider {
  send(prompt: TPromptMessage[]): Promise<string>
}
