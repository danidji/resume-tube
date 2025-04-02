export enum EPromptProviderType {
  OPEN_AI = 'openai',
  DEEPSEEK = 'deepseek',
}

export enum EDeepSeekModel {
  Chat = 'deepseek-chat',
  Reasoner = 'deepseek-reasoner',
}

export enum EOpenAIModel {
  GPT35 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  GPT4Turbo = 'gpt-4-turbo-preview',
}

export enum ECompletionRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  DEVELOPER = 'developer',
}
