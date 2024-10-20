import Koa from 'koa'
import serve from 'koa-static'
import path from 'node:path'
import fs from 'node:fs'
import { koaBody } from 'koa-body'
import Handlebars from 'handlebars'

import { Database } from './db.js'

const title = 'Protomachine'

const template = (body) => `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <script src="/htmx.min.js"></script>
  <link rel="stylesheet" href="./matcha.lite.css">
  <viewport content="width=device-width, initial-scale=1">
</head>
<body>
<header>
  <nav>
    <menu>
      <li>
        <a href="/">${title}</a>
      </li>
      <li>
        <a href="/1">Page 1</a>
      </li>
      <li>
        <a href="/2">Page 2</a>
      </li>
    </menu>
  </nav>
  </header>
<main>
  ${body}
</main>
<footer>
  <p>${new Date().toLocaleString('sv')}</p>
</footer>
</body>
</html>
`.trim()

const readView = name =>
  Handlebars.compile(
    template(
      fs.readFileSync(`./src/views/${name}.html`, 'utf8')
        .toString().trim()
    )
  )

const views = {
  root: readView('root'),
  notFound: readView('notFound')
}

export class SimpleApp {
  constructor (dbLocation) {
    this.database = new Database(dbLocation)

    this.app = new Koa()

    this.app.use(serve(path.join('./node_modules/htmx.org/dist/')))
    this.app.use(serve(path.join('./node_modules/@lowlighter/matcha/dist/')))
    this.app.use(koaBody())

    this.app.use(async (ctx, next) => {
      console.dir(ctx.path)
      if (ctx.path.startsWith('/api')) {
        ctx.type = 'text/plain'
        switch (ctx.path) {
          case '/api/insert':
            try {
              await this.database.insert(ctx.request.body)
              ctx.body = (await this.database.query())
                .map(row => `${row.key}: ${row.value}`)
                .join('\n<br/>')
            } catch (error) {
              ctx.body = error.message
            }
            break
          default:
            throw new Error('Unknown route')
        }
      } else {
        await next()
      }
    })

    this.app.use(async ctx => {
      ctx.type = 'html'
      switch (ctx.path) {
        case '/':
          ctx.body = views.root({ title })
          break
        default:
          ctx.status = 404
          ctx.body = views.notFound({
            method: ctx.method,
            path: ctx.path
          })
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
