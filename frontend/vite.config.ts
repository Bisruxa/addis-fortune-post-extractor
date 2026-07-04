import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const archiveDir = path.resolve(rootDir, '../data/archive')

const EDITION_FALLBACK_DIRS = [
  'vol 7 No 364 images/images',
  'vol 7 No 364 images',
]

function resolveArchiveFile(requestPath: string): string | null {
  const decoded = decodeURIComponent(requestPath.replace(/^\/+/, ''))
  const direct = path.normalize(path.join(archiveDir, decoded))

  if (direct.startsWith(archiveDir) && fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return direct
  }

  if (!/vol\s+7\s+no\s+\d+\s+images/i.test(decoded)) {
    return null
  }

  const basename = path.basename(decoded)
  for (const dir of EDITION_FALLBACK_DIRS) {
    const fallback = path.normalize(path.join(archiveDir, dir, basename))
    if (fallback.startsWith(archiveDir) && fs.existsSync(fallback) && fs.statSync(fallback).isFile()) {
      return fallback
    }
  }

  return null
}

function archiveStaticPlugin(): Plugin {
  const middleware = (
    req: import('http').IncomingMessage,
    res: import('http').ServerResponse,
    next: (err?: unknown) => void,
  ) => {
    const requestPath = decodeURIComponent((req.url || '/').split('?')[0])
    const filePath = resolveArchiveFile(requestPath)

    if (!filePath) {
      next()
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    const types: Record<string, string> = {
      '.gif': 'image/gif',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    }

    res.setHeader('Content-Type', types[ext] || 'application/octet-stream')
    fs.createReadStream(filePath).pipe(res)
  }

  return {
    name: 'archive-static',
    configureServer(server) {
      server.middlewares.use('/archive', middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/archive', middleware)
    },
  }
}

export default defineConfig({
  plugins: [react(), archiveStaticPlugin()],
  server: {
    port: 5173,
    fs: {
      allow: ['..'],
    },
  },
})
