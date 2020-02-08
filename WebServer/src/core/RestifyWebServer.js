const restify = require('restify')

const http = require('http')
const uuidv4 = require('uuid/v4')
const uaParser = require('ua-parser-js') // user-agent parser


class RestifyWebServer {
    constructor (options) {
        const self = this
        if (!(options.webserver && options.webserver.constructor === ({}).constructor)) {

            options.webserver = {}

        }

        this.httpServer = null
        this.httpsServer = null

        this.port = (typeof options.webserver.port === 'number') ? options.webserver.port : 3000


        this.host = (typeof options.webserver.host === 'string') ? options.webserver.host : '127.0.0.1'


        this.trustProxy = (typeof options.webserver.trustProxy === 'boolean') ? options.webserver.trustProxy : false




        this.httpVersion = (/^(2\.0|1\.1|1\.0)$/g.test(options.webserver.httpVersion)) ? options.webserver.httpVersion : '1.0'


        this.HttpToHttps = (options.webserver.HttpToHttps.constructor === ({}).constructor) ? options.webserver.HttpToHttps : { isRequired: false }



        const serverOpt = {}


        if (options.webserver.ssl.key && options.webserver.ssl.cert && this.httpVersion === '2.0')
            serverOpt.http2 = {
                key: options.webserver.ssl.key,
                cert: options.webserver.ssl.cert
            }
        else if (options.webserver.ssl.key && options.webserver.ssl.cert && this.httpVersion === '2.0')
            serverOpt.https = {
                key: options.webserver.ssl.key,
                cert: options.webserver.ssl.cert
            }

        this.httpsServer = restify.createServer(serverOpt)


        this.httpsServer.use((req, res, next) => {



            req._id = uuidv4()
            let ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.connection.socket.remoteAddress
            if (ipAddress && ipAddress.substr(0, 7) === '::ffff:') {
                ipAddress = ipAddress.substr(7)
                req._ip = ipAddress
            }
            req._ua = uaParser(req.headers['user-agent'])

            next()

        })



        if (SYS.logger.isRequired) {

            this.httpsServer.use(require('morgan')((tokens, req, res) => {
                console.log('://')
                return [
                    '[' + req._id + '] :',
                    '<' + req._ip,
                    req._ua.os.name,
                    req._ua.browser.name + '/' + req._ua.browser.version,
                    req._ua.cpu.architecture + '>',


                    tokens.method(req, res),
                    '<' + tokens.url(req, res) + '>(' + tokens.status(req, res) + ')',

                    tokens.res(req, res, 'content-length') + '<Bytes>', '-',
                    tokens['response-time'](req, res)/* / 1000 */, 'ms'


                ].join(' ')
            }, { stream: SYS.logger.Http.loggerStream }))
        }


        this.httpsServer.use(require('../app/middlewares/OptimizeUrl')({
            type: 'add',
            statusCode: 301,
            skip: false,
            methods: 'get,head',
            beforeRedirect: () => {
                // log
            }

        }))

        this.httpsServer.get('*', this._pageNotFound.bind(this))


        this.httpsServer.get('/api/*', this._apiNotFound.bind(this))

        if (this.HttpToHttps.isRequired) {
            this.httpServer = http.createServer((req, res) => {
                const {
                    headers: { host },
                    url
                } = req

                if (host) {
                    let _host = ''
                    if (this.port === 80 || this.port === 443)
                        _host = host.split(':')[0]
                    else
                        _host = host.split(':')[0] + ':' + this.port


                    res.writeHead(301, {
                        Location: `https://${_host}${url}`
                    })
                    res.end()
                } else {
                    res.end()
                }
            })


        }
    }


    _apiNotFound (req, res, next) {
        return this.apiNotFound(req, res, next)
    }

    apiNotFound (req, res, next) {
        res.send({
            status: 'failed',
            message: 'Route Not Found',
            code: 'ROUTE_NOT_FOUND'
        })
    }




    _pageNotFound (req, res, next) {
        return this.pageNotFound(req, res, next)
    }

    pageNotFound (req, res, next) {
        res.send('<h1>page Not Found</h1>')
        // next()
    }






    start () {
        if (this.httpsServer != null)
            this.httpsServer.listen(this.port, (e) => {
                console.log('The host : 127.0.0.1:' + this.port)
            })

        if (this.httpServer != null)
            this.httpServer.listen(this.HttpToHttps.port || 80)
    }


}


module.exports = RestifyWebServer
