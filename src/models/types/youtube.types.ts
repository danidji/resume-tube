import { EUseWhisper } from '../enums/whisper.enums'

export type TDownloadProgress = {
  percent: number
  totalSize: number
  currentSpeed: number
  eta: number
}

export type TDownloadResult = {
  success: boolean
  filename?: string
  error?: string
}

export type TDeleteResult = {
  success: boolean
  error?: string
}

export type TDownloadRequest = {
  url: string
}

export type TTranscribeRequest = TDownloadRequest & {
  from: EUseWhisper
}
