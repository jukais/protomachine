import { test, describe } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'

import { SimpleApp } from './app.js'

// Tests
describe('Koa Server', () => {
  const { app } = new SimpleApp(':memory:')

  test.it('should return the main page', async () => {
    const { status, type, text } = await request(app.callback()).get('/')

    assert.strictEqual(status, 200)
    assert.strictEqual(type, 'text/html')
    assert.match(text, /<!DOCTYPE html>/)
  })

  test.it('should return hello from HTMX', async () => {
    const { status, type, text } = await request(app.callback())
      .post('/api/insert')
      .send({ key: 'htmx', value: 'Hello from HTMX!' })

    assert.strictEqual(status, 200)
    assert.strictEqual(type, 'text/plain')
    assert.match(text, /Hello from HTMX!/)
  })

  test.it('should return 404 for unknown routes', async () => {
    const { status, type, text } = await request(app.callback()).get('/unknown')

    assert.strictEqual(status, 404)
    assert.strictEqual(type, 'text/html')
    assert.match(text, /Page Not Found/)
  })
})
