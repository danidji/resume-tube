import { ECompletionRole, EProviderType } from '@/models/enums/ai-model.enums'
import { TPromptMessage, TSummaryPromptOptions } from '@/models/types/ai-model.types'

export function buildSummaryPrompt(
  textToSummarize: string,
  modelType: EProviderType,
  options: TSummaryPromptOptions
): TPromptMessage[] {
  const { detailLevel, outputLanguage, expertiseLevel } = options
  const systemRole =
    modelType === EProviderType.DEEPSEEK ? ECompletionRole.SYSTEM : ECompletionRole.DEVELOPER

  const system: TPromptMessage = {
    role: systemRole,
    content: `
You are an expert in text analysis and summarization. Your task is to generate a clear, structured, and faithful summary of a given text (in English or French), according to the user's preferences.

Your goal is to help someone understand the full meaning of the text quickly, without losing key information.

**General Instructions:**
- Output must be in **${outputLanguage}** and formatted using **Markdown**.
- Do not add comments or personal opinions.
- Rephrase with precision. Retain all essential ideas.
- Be exhaustive: include all main arguments, reasoning, and key examples. Omit only redundancies or trivial information.

**Level of detail:**
- **short** → one paragraph
- **detailed** → use subtitles and bullet points

**Expertise adaptation:**
- **beginner** → simplify concepts, avoid jargon, explain technical terms
- **intermediate** → use accessible language with appropriate terminology
- **advanced** → retain original complexity and technical terms

**Special Cases:**
- If the text contains multiple sections, themes, or arguments, create a structured summary with separate sections per topic, each with its own heading and bullet points if needed.
- If a concept is unclear or complex, do not skip it. Try to reformulate it as clearly as possible while preserving its intent.
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
