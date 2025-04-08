import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { join } from 'path'
import { promises as fs } from 'fs'

ffmpeg.setFfmpegPath(ffmpegStatic as string)

export class AudioService {
  public async splitAudio(inputPath: string, chunkDuration: number): Promise<string[]> {
    const outputDir = join(process.cwd(), 'public', 'audio-chunks', `chunks-${Date.now()}`)
    await fs.mkdir(outputDir, { recursive: true })

    return new Promise((resolve, reject) => {
      let outputFiles: string[] = []

      ffmpeg(inputPath)
        .on('error', (err: Error) => {
          reject(new Error(`Erreur lors du découpage audio: ${err.message}`))
        })
        .on('progress', (progress: { percent?: number }) => {
          if (progress.percent) {
            console.info(`Progression: ${Math.floor(progress.percent)}%`)
          }
        })
        .outputOptions([
          '-f segment',
          `-segment_time ${chunkDuration}`,
          '-c copy',
          '-map 0',
          '-reset_timestamps 1',
        ])
        .output(join(outputDir, 'chunk-%03d.mp3'))
        .on('start', (commandLine: string) => {
          console.info('Commande ffmpeg:', commandLine)
        })
        .on('end', async () => {
          try {
            const files = await fs.readdir(outputDir)
            outputFiles = files.map((file) => join(outputDir, file))
            resolve(outputFiles)
          } catch (error) {
            reject(new Error(`Erreur lors de la lecture du dossier de sortie: ${error}`))
          }
        })
        .run()
    })
  }

  public async cleanAudioChunks(chunkPaths: string[]): Promise<void> {
    if (chunkPaths.length === 0) return

    try {
      const parentDir = chunkPaths[0].split('/').slice(0, -1).join('/')

      try {
        const stats = await fs.stat(parentDir)
        if (stats.isDirectory()) {
          await fs.rm(parentDir, { recursive: true, force: true })
        }
      } catch (error) {
        console.info(`Le dossier ${parentDir} a déjà été supprimé`)
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage du dossier audio:', error)
    }
  }
}

export const audioService = new AudioService()
