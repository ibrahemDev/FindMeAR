// SYS.restifyWebServer




const restify = require('restify')
const contents = require('../../contents')
const Permissions = require('../middlewares/Permissions')
const Emergencie = require('./api/Emergencie_.js')
const Access = require('./api/Access_')
const PhoneCode = require('./api/PhoneCode_')
const Account = require('./api/Account_')
const MapAi = require('./api/MapAi_')
const NotFound = require('./NotFound.js')
const path = require('path')
const fs = require('fs')




class Routes {
    constructor () {

        this.restify = SYS.restifyWebServer



        // public folder
        SYS.restifyWebServer.httpsServer.get('/public/*', [
            restify.plugins.serveStaticFiles('./src/public'),
            Permissions([
                contents.PERMISSIONS.GUEST,
                contents.PERMISSIONS.ADMIN
            ], (req, res, next) => {
                res.send({
                    status: 'failed',
                    message: 'Route Not Found',
                    code: 'ROUTE_NOT_FOUND'
                })
            })
        ])




        this.notFound = new NotFound()




        // AI routes
        this.mapAi = new MapAi()
        SYS.restifyWebServer.httpsServer.get('/api/map/ai/get_all_areas/', [
            ...this.mapAi.middlewares('get', [
                contents.PERMISSIONS.ADMIN
            ]),
            this.mapAi.getAllAreas.bind(this.mapAi)
        ])
        SYS.restifyWebServer.httpsServer.post('/api/map/ai/sort_emergencies/', [
            ...this.mapAi.middlewares('post', [
                contents.PERMISSIONS.ADMIN
            ]),
            this.mapAi.sortEmergencies.bind(this.mapAi)
        ])
        SYS.restifyWebServer.httpsServer.post('/api/map/ai/calculate_hours/', [
            ...this.mapAi.middlewares('post', [
                contents.PERMISSIONS.ADMIN
            ]),
            this.mapAi.calculateHours.bind(this.mapAi)
        ])
        SYS.restifyWebServer.httpsServer.post('/api/map/ai/start_ai_training/', [
            ...this.mapAi.middlewares('post', [
                contents.PERMISSIONS.ADMIN
            ]),
            this.mapAi.startAiTraining.bind(this.mapAi)
        ])





        // emergencies routes
        this.emergencie = new Emergencie()
        SYS.restifyWebServer.httpsServer.get('/api/emergency/:id/', [
            ...this.emergencie.middlewares('get', [
                contents.PERMISSIONS.ADMIN,
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC
            ]),
            this.emergencie.getById.bind(this.emergencie)
        ])
        SYS.restifyWebServer.httpsServer.get('/api/emergency/', [
            ...this.emergencie.middlewares('get', [
                contents.PERMISSIONS.PARAMEDIC
            ]),
            this.emergencie.get.bind(this.emergencie)
        ])
        SYS.restifyWebServer.httpsServer.get('/api/emergencies/', [
            ...this.emergencie.middlewares('get', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC,
                contents.PERMISSIONS.ADMIN
            ]),
            this.emergencie.getAll.bind(this.emergencie)
        ])

        SYS.restifyWebServer.httpsServer.get('/api/emergencies2date/', [
            ...this.emergencie.middlewares('get', [
                contents.PERMISSIONS.ADMIN
            ]),
            this.emergencie.getAll2Date.bind(this.emergencie)
        ])
        SYS.restifyWebServer.httpsServer.post('/api/emergency/', [
            ...this.emergencie.middlewares('post', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.ADMIN
            ]),
            this.emergencie.post.bind(this.emergencie)
        ])
        SYS.restifyWebServer.httpsServer.put('/api/emergency/:id/', [
            ...this.emergencie.middlewares('post', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC
            ]),
            this.emergencie.putById.bind(this.emergencie)
        ])



        // login routes
        this.access = new Access()
        SYS.restifyWebServer.httpsServer.post('/api/access/', [
            ...this.access.middlewares('post', [
                contents.PERMISSIONS.GUEST

            ]),
            this.access.post.bind(this.access)
        ])
        SYS.restifyWebServer.httpsServer.get('/api/isAccess/', [
            ...this.access.middlewares('get', [
                contents.PERMISSIONS.GUEST,
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC,
                contents.PERMISSIONS.ADMIN

            ]),
            this.access.getIsAccess.bind(this.access)
        ])


        this.phoneCode = new PhoneCode()
        SYS.restifyWebServer.httpsServer.post('/api/phone_code/', [
            ...this.phoneCode.middlewares([
                contents.PERMISSIONS.GUEST
            ]),
            this.phoneCode.post.bind(this.phoneCode)
        ])
        SYS.restifyWebServer.httpsServer.get('/api/phone_code/', this.phoneCode.get([
            contents.PERMISSIONS.GUEST
        ]))



        this.account = new Account()
        SYS.restifyWebServer.httpsServer.get('/api/account/', [
            ...this.account.middlewares('get', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC,
                contents.PERMISSIONS.ADMIN

            ]),
            this.account.get.bind(this.account)
        ])
        SYS.restifyWebServer.httpsServer.put('/api/account/', [
            ...this.account.middlewares('put', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC,
                contents.PERMISSIONS.ADMIN

            ]),
            this.account.putSelf.bind(this.account)
        ])


        // api notfound here
        SYS.restifyWebServer.httpsServer.get('/api/*', SYS.restifyWebServer.middlewares.OptimizeUrl({
            type: 'add', // add slash last url
            statusCode: 301, // this for redirect
            skip: false, //
            methods: 'get,head', // work with this methods
            beforeRedirect: () => {
                // log
            }
        }), this._apiNotFound.bind(this))





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
        // next()
    }
}


module.exports = Routes

