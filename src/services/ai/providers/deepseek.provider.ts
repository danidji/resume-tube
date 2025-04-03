import { IPromptProvider } from '@/models/interfaces/prompt.interfaces'
import { DeepSeekService } from '../deepseek.service'
import { EDeepSeekModel, TCompletionConfig, TPromptMessage } from '@/models'

export class DeepSeekPromptProvider implements IPromptProvider {
  constructor(
    private readonly deepseekService: DeepSeekService,
    private readonly model: EDeepSeekModel = EDeepSeekModel.CHAT,
    private readonly config?: Partial<TCompletionConfig>
  ) {}

  async send(prompt: TPromptMessage[]): Promise<string> {
    return this.deepseekService.chatCompletion(prompt, this.model, this.config)
  }
}
