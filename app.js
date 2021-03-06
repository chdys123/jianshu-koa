const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const MongoConnect = require('./db/index')
const cors = require("koa2-cors")
const koajwt = require("koa-jwt")

// 连接数据库
MongoConnect()

const users = require('./routes/users')
const upload = require("./routes/upload")
const article = require("./routes/article")
const comment = require("./routes/comment")
const draft = require("./routes/draft")
const serach = require("./routes/serach")


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(cors())

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))


app.use(koajwt({
  secret: "jianshu-server-jwt"
}).unless({
  path: [/^\/login/, /^\/reg/, /^\/article\/findAll/, /^\/article\/findOne/, /^\/article\/hotArticle/, /^\/serach/,/^\/user\/getFans/]
}))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(users.routes(), users.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())
app.use(article.routes(), article.allowedMethods())
app.use(comment.routes(), comment.allowedMethods())
app.use(draft.routes(), draft.allowedMethods())
app.use(serach.routes(), serach.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

