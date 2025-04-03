import dotenv from 'dotenv'
dotenv.config()

export const Config = {
  openAiApiKey: process.env.OPEN_AI_API_KEY,
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
}
