import Koa from 'koa'
import serve from 'koa-static'
import path from 'path'
import { Database } from './db.js'
import { randomUUID } from 'crypto'

const template = (body) => `
<!DOCTYPE html>
<html>
<head>
    <title>Koa Server with HTMX</title>
    <script src="/htmx.min.js"></script>
</head>
<body>
${body}
</body>
</html>
`

export class SimpleApp {
  constructor (dbLocation) {
    this.database = new Database(dbLocation)
    this.app = new Koa()
    this.app.use(serve(path.join('./node_modules/htmx.org/dist/')))
    this.app.use(async ctx => {
      switch (ctx.path) {
        case '/':
          ctx.type = 'html'
          ctx.body = template(`
                <h1>Hello, Koa!</h1>
                    <button hx-get="/hello" hx-target="#response">Click me</button>
                <div id="response"></div>
                `)
          break
        case '/hello':
          await this.database.insert({
            key: randomUUID(),
            value: 'Hello from HTMX!'
          })

          ctx.type = 'text/plain'
          ctx.body = (await this.database.query())
            .map(row => `${row.key}: ${row.value}`)
            .join('\n<br/>')
          break
        default:
          ctx.status = 404
          ctx.type = 'html'
          ctx.body = template(
            `Page Not Found: ${ctx.method}: ${ctx.path}
            <br/>
            <a href="/">Go back</a>`
          )
      }
    })
  }

  async listen (port) {
    return new Promise((resolve, reject) => {
      const server = this.app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
        resolve(server)
      })
    })
  }

  async close () {
    await this.app.close()
  }
}
