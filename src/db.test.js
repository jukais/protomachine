import { test, describe } from 'node:test'
import assert from 'node:assert'
import { randomUUID } from 'node:crypto'

import { Database } from './db.js'

// Tests
describe('Database', () => {
  const db = new Database(':memory:')

  test.it('should insert a key-value pair into the database', async () => {
    await db.insert({ key: 'key1', value: 'value1' })

    const result = await db.query()

    assert.deepEqual(result, [{ key: 'key1', value: 'value1' }])
  })

  test.it('should retrieve all key-value pairs from the database', async () => {
    const data = { key: randomUUID(), value: 'value' }

    await db.insert(data)

    const result = await db.query()
    assert.deepEqual(result.filter(row => row.key === data.key), [data])
  })

  test.it('should handle duplicate keys by throwing an error', async () => {
    try {
      await db.insert({ key: 'key1', value: 'value1' })
      await db.insert({ key: 'key1', value: 'value1' })
    } catch (error) {
      assert.match(error.message, /UNIQUE constraint failed/)
    }
  })
})
