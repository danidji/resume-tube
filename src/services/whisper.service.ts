import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { TTranscriptionResult, TTranscriptionError } from '@/models'
import { OpenAIService, openAIService } from './openai.service'

export class WhisperService {
  private readonly model: string = 'base'

  constructor(private readonly openaiService: OpenAIService) {}

  public async transcribe(
    audioFilePath: string
  ): Promise<TTranscriptionResult | TTranscriptionError> {
    try {
      if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Le fichier audio ${audioFilePath} n'existe pas`)
      }

      const outputPath = path.join(
        path.dirname(audioFilePath),
        `${path.basename(audioFilePath, path.extname(audioFilePath))}.txt`
      )

      return new Promise((resolve) => {
        console.log('Démarrage de la transcription...')
        let isResolved = false

        const whisperProcess = spawn(
          'whisper',
          [audioFilePath, '--model', this.model, '--output_dir', path.dirname(audioFilePath)],
          {
            env: process.env,
          }
        )

        whisperProcess.stdout.on('data', (data) => {
          console.log('Whisper progression:', data.toString())
        })

        whisperProcess.stderr.on('data', (data) => {
          console.log('Whisper détails:', data.toString())
        })

        whisperProcess.on('close', (code) => {
          console.log('Transcription terminée avec le code:', code)

          if (isResolved) return

          if (code !== 0) {
            isResolved = true
            resolve({
              error: `La transcription a échoué avec le code ${code}`,
            })
            return
          }

          if (!fs.existsSync(outputPath)) {
            isResolved = true
            resolve({
              error: "La transcription n'a pas pu être générée",
            })
            return
          }

          const transcription = fs.readFileSync(outputPath, 'utf-8').trim()
          fs.unlinkSync(outputPath)

          this.cleanupGeneratedFiles(audioFilePath)

          isResolved = true
          resolve({
            text: transcription,
          })
        })

        whisperProcess.on('error', (error) => {
          if (!isResolved) {
            console.error('Erreur lors de la transcription:', error)
            isResolved = true
            resolve({
              error: error.message,
            })
          }
        })
      })
    } catch (error) {
      console.error('Erreur complète:', error)
      return {
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
      }
    }
  }

  public async transcribeWithAPI(
    audioFilePath: string
  ): Promise<TTranscriptionResult | TTranscriptionError> {
    try {
      if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Le fichier audio ${audioFilePath} n'existe pas`)
      }

      if (!this.openaiService) {
        throw new Error("Le service OpenAI n'est pas injecté")
      }

      const transcription = await this.openaiService.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: 'whisper-1',
        response_format: 'text',
      })

      return {
        text: transcription,
      }
    } catch (error) {
      console.error("Erreur lors de la transcription avec l'API:", error)
      return {
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
      }
    }
  }

  private cleanupGeneratedFiles(audioFilePath: string): void {
    const basePath = path.join(
      path.dirname(audioFilePath),
      path.basename(audioFilePath, path.extname(audioFilePath))
    )

    const extensions = ['.txt', '.json', '.srt', '.tsv', '.vtt']

    extensions.forEach((ext) => {
      const filePath = `${basePath}${ext}`
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
          console.log(`Fichier supprimé: ${filePath}`)
        } catch (error) {
          console.error(`Erreur lors de la suppression de ${filePath}:`, error)
        }
      }
    })
  }
}

export const whisperService = new WhisperService(openAIService)
