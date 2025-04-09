import { IPromptProvider } from '@/models/interfaces/prompt.interfaces'
import { OpenAIService } from '../openai.service'
import { EOpenAIModelLLM, TCompletionConfig, TPromptMessage } from '@/models'

export class OpenAIPromptProvider implements IPromptProvider {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly model: EOpenAIModelLLM = EOpenAIModelLLM.GPT35,
    private readonly config?: Partial<TCompletionConfig>
  ) {}

  async send(prompt: TPromptMessage[]): Promise<string> {
    return this.openAIService.chatCompletion(prompt, this.model, this.config)
  }
}
