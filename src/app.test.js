import { describe, it, expect } from 'vitest'
import request from 'supertest'

import { SimpleApp } from './app.js'

// Tests
describe('Koa Server', () => {
  const { #app: app } = new SimpleApp(':memory:')

  it('should return the main page', async () => {
    const { status, type, text } = await request(app.callback()).get('/')

    expect(status).toBe(200)
    expect(type).toBe('text/html')
    expect(text).toMatch(/<!DOCTYPE html>/)
  })

  it('should return hello from HTMX', async () => {
    const { status, type, text } = await request(app.callback())
      .post('/api/insert')
      .send({ key: 'htmx', value: 'Hello from HTMX!' })

    expect(status).toBe(200)
    expect(type).toBe('text/plain')
    expect(text).toMatch(/Hello from HTMX!/)
  })

  it('should return 404 for unknown routes', async () => {
    const { status, type, text } = await request(app.callback()).get('/unknown')

    expect(status).toBe(404)
    expect(type).toBe('text/html')
    expect(text).toMatch(/Page Not Found/)
  })
})
