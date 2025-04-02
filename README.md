# API de téléchargement et transcription audio YouTube

Cette API permet de télécharger l'audio d'une vidéo YouTube et de récupérer sa transcription automatiquement via Whisper.
LE but est de pouvoir créer un résumé d'une vidéo YouTube grâce à ChatGPT.

## Stack technique

- **Node.js**
- **TypeScript**
- **Fastify** 
- **youtube-dl-exec** – pour le téléchargement audio
- **Whisper** (CLI) – pour la transcription en local
