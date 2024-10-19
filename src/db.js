// Vite didn't support just importing sqlite
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { DatabaseSync } = require(
  'node:sqlite'
)

export class Database {
  constructor (location) {
    this.database = new DatabaseSync(location)

    this.database.exec(`
        CREATE TABLE IF NOT EXISTS data(
          key TEXT PRIMARY KEY,
          value TEXT
        ) STRICT
      `)

    this.insertStmt = this.database.prepare('INSERT INTO data (key, value) VALUES (?, ?)')
    this.queryStmt = this.database.prepare('SELECT * FROM data ORDER BY key')
  }

  async insert ({ key, value }) {
    this.insertStmt.run(key, value)
  }

  async query () {
    return this.queryStmt.all()
  }
}
