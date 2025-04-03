import { IPromptProvider } from '@/models/interfaces/prompt.interfaces'
import { OpenAIService } from '../openai.service'
import { EOpenAIModel, TCompletionConfig, TPromptMessage } from '@/models'

export class OpenAIPromptProvider implements IPromptProvider {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly model: EOpenAIModel = EOpenAIModel.GPT35,
    private readonly config?: Partial<TCompletionConfig>
  ) {}

  async send(prompt: TPromptMessage[]): Promise<string> {
    return this.openAIService.chatCompletion(prompt, this.model, this.config)
  }
}
