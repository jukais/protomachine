import DatabaseSync from 'better-sqlite3'

export class Database {
  #database
  #insert
  #query
  constructor (location) {
    this.#database = new DatabaseSync(location)

    this.#database.exec(`
        CREATE TABLE IF NOT EXISTS data(
          key TEXT PRIMARY KEY,
          value TEXT
        ) STRICT
      `)
    this.#database.pragma('journal_mode = WAL')
    this.#insert = this.#database.prepare(
      'INSERT INTO data (key, value) VALUES (?, ?)'
    )
    this.#query = this.#database.prepare(
      'SELECT * FROM data ORDER BY key'
    )
  }

  insert ({ key, value }) {
    this.#insert.run(key, value)
  }

  query () {
    return this.#query.all()
  }
}
