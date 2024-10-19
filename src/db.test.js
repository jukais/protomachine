import { describe, it, expect } from 'vitest'
import { Database } from './db.js'
import { randomUUID } from 'node:crypto'

// Tests
describe('Database', () => {
  const db = new Database(':memory:')

  it('should insert a key-value pair into the database', async () => {
    await db.insert({ key: 'key1', value: 'value1' })

    const result = await db.query()

    expect(result).toEqual([{ key: 'key1', value: 'value1' }])
  })

  it('should retrieve all key-value pairs from the database', async () => {
    const data = { key: randomUUID(), value: 'value' }

    await db.insert(data)

    const result = await db.query()
    expect(result.filter(row => row.key === data.key)).toEqual([data])
  })

  it('should handle duplicate keys by throwing an error', async () => {
    try {
      await db.insert({ key: 'key1', value: 'value1' })
      await db.insert({ key: 'key1', value: 'value1' })
    } catch (error) {
      expect(error.message).toContain('UNIQUE constraint failed')
    }
  })
})
