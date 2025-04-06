import { ECompletionRole, EPromptProviderType } from '@/models/enums/prompt.enums'
import { TPromptMessage, TSummaryPromptOptions } from '@/models/types/prompt.types'

export function buildSummaryPrompt(
  textToSummarize: string,
  modelType: EPromptProviderType,
  options: TSummaryPromptOptions
): TPromptMessage[] {
  const { detailLevel, outputLanguage, expertiseLevel } = options
  const systemRole =
    modelType === EPromptProviderType.DEEPSEEK ? ECompletionRole.SYSTEM : ECompletionRole.DEVELOPER

  const system: TPromptMessage = {
    role: systemRole,
    content: `
You are an expert in text analysis and summarization. Your task is to generate a clear, structured, and faithful summary of a given text (in English or French), according to the user's preferences.

Output must be in **${outputLanguage}** and formatted using **Markdown**.

Do not add comments or personal opinions. Rephrase with precision. Retain all essential ideas.

Adapt your summary to the requested level of detail:
- **short** → one paragraph
- **detailed** → use subtitles and bullet points

Adjust the language complexity based on the user's expertise:
- **beginner** → simplify concepts, avoid jargon, explain technical terms
- **intermediate** → use accessible language with appropriate terminology
- **advanced** → retain original complexity and technical terms

Your goal is to help someone understand the full meaning of the text quickly, without losing key information.
    `.trim(),
  }

  const user: TPromptMessage = {
    role: ECompletionRole.USER,
    content: `
Summary level: ${detailLevel}
Output language: ${outputLanguage}
Reader expertise level: ${expertiseLevel}

Please summarize the following text accordingly:

${textToSummarize}
    `.trim(),
  }
  return [system, user]
}
