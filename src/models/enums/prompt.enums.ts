export enum EProviderType {
  OPEN_AI = 'openai',
  DEEPSEEK = 'deepseek',
}

export enum EDeepSeekModel {
  CHAT = 'deepseek-chat',
  REASONER = 'deepseek-reasoner',
}

export enum EOpenAIModel {
  GPT35 = 'gpt-3.5-turbo',
  GPT4o = 'gpt-4o',
  GPT4oMini = 'gpt-4o-mini',
}

export enum ECompletionRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  DEVELOPER = 'developer',
}

export enum EDetailLevel {
  SHORT = 'short',
  DETAILED = 'detailed',
}

export enum EExpertiseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}
