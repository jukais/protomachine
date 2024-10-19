import { SimpleApp } from './app.js'
import path from 'path'

const rootFolder = process.cwd()
console.log(`Server started in root folder: ${rootFolder}`)

const dbLocation = path.join('./db/data.db')
const server = new SimpleApp(dbLocation)

const port = 3000
server.listen(port)

process.on('SIGTERM', async () => {
  await server.close()
})
