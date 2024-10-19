import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { SimpleApp } from './app.js'

// Tests
describe('Koa Server', () => {
  const { app } = new SimpleApp(':memory:')

  it('should return the main page', async () => {
    const { status, type, text } = await request(app.callback()).get('/')
    expect(status).toBe(200)
    expect(type).toBe('text/html')
    expect(text).toContain('<h1>Hello, Koa!</h1>')
  })

  it('should return hello from HTMX', async () => {
    const { status, type, text } = await request(app.callback()).get('/hello')
    expect(status).toBe(200)
    expect(type).toBe('text/plain')
    expect(text).toMatch('Hello from HTMX!')
  })

  it('should return 404 for unknown routes', async () => {
    const { status, type, text } = await request(app.callback()).get('/unknown')
    expect(status).toBe(404)
    expect(type).toBe('text/html')
    expect(text).toContain('Page Not Found')
  })
})
