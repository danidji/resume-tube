import { IPromptProvider } from '@/models/interfaces/prompt.interfaces'
import { TPromptMessage } from '@/models'

export class PromptManagerService {
  constructor(private readonly provider: IPromptProvider) {}

  async send(prompt: TPromptMessage): Promise<string> {
    return this.provider.send(prompt)
  }
}
