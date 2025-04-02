import youtubeDl from 'youtube-dl-exec'
import path from 'path'
import fs from 'fs'
import { TDownloadResult, TDeleteResult } from '@/models'

export class YoutubeService {
  private readonly outputDir: string = 'public/files'

  constructor() {
    // Créer le dossier de sortie s'il n'existe pas
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  public async downloadAudio(url: string): Promise<TDownloadResult> {
    try {
      const outputTemplate = path.join(this.outputDir, '%(title)s.%(ext)s')
      await youtubeDl(url, {
        output: outputTemplate,
        extractAudio: true,
        audioFormat: 'mp3',
        addMetadata: true,
        noCheckCertificates: true,
      })

      const files = fs.readdirSync(this.outputDir)
      const downloadedFile = files.find((file) => file.endsWith('.mp3'))

      if (!downloadedFile) {
        throw new Error('Impossible de trouver le fichier téléchargé')
      }

      return {
        success: true,
        filename: downloadedFile,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
      }
    }
  }

  public deleteAudio(filename: string): TDeleteResult {
    try {
      const filePath = path.join(this.outputDir, filename)

      if (!fs.existsSync(filePath)) {
        throw new Error(`Le fichier ${filename} n'existe pas`)
      }

      fs.unlinkSync(filePath)

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
      }
    }
  }
}

export const youtubeService = new YoutubeService()
