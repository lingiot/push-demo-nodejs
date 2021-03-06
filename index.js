const Koa = require('koa')
const Router = require('koa-router')
const sha1 = require('node-sha1')

const port = 12306

const app = new Koa()
const router = new Router()

router.get(`/`, async (ctx) => {
    ctx.response.body = 'linxot push demo'
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

    // 在这里对 token、signature 之类的参数进行安全性校验，防止他人恶意调用接口（可选）
    const { echostr, nonce, signature, timestamp } = ctx.request.query
    const token = 'my_token' // TODO 这里改成在灵联云配置的 token
    // 将 token、timestamp、nonce 三个参数进行字典序排序，并拼接成一个字符串
    const str = [token, timestamp, nonce].sort().join('')
    // console.log('str', str)
    // 对拼接字符串进行 SHA1 加密 
    const text = sha1(str).toUpperCase()
    // 开发者获得加密后的字符串可与 signature 对比
    if (text === signature) {
        // TODO 是灵联服务器的请求，在这里写相关的业务逻辑
        console.log('ok')
    }

    // 返回 echostr
    ctx.response.body = echostr
})

// 有告警等数据时，会回调这个接口
router.post(`/pushCallback`, async (ctx) => {
    console.log('post', ctx.request.body)

    ctx.response.body = 'success'
})

app.use(router.routes())

app.listen(port)

console.log(`http://localhost:${port}`)
