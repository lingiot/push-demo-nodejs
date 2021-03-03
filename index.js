const Koa = require('koa')
const Router = require('koa-router')

const port = 12306

const app = new Koa()
const router = new Router()

router.get(`/`, async (ctx) => {
    ctx.response.body = 'liniot'
})

// 在「系统信息」-> 「开发配置」菜单下配置推送 URL 时，会调用这个接口
router.get(`/pushCallback`, async (ctx) => {
    console.log('GET /pushCallback')
    console.log('query', ctx.request.query)
    // =>
    // {
    //     echostr: '2R1pb0',
    //     nonce: '9719',
    //     signature: '458C23A346BF4794131C5BF8A8AB1EBFA7706D67',
    //     timestamp: '1614748801549'
    // }

    // TODO 在这里对 token、signature 之类的参数进行安全性校验，防止他人恶意调用接口（可选）

    // 返回 echostr
    ctx.response.body = ctx.request.query.echostr
})

// 有告警等数据时，会回调这个接口
router.post(`/pushCallback`, async (ctx) => {
    console.log('post', ctx.request.body)
    
    ctx.response.body = 'success'
})

app.use(router.routes())

app.listen(port)

console.log(`http://localhost:${port}`)
