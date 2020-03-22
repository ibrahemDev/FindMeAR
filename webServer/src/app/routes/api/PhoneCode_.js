const restify = require('restify')
const Joi = require('@hapi/joi')
const contents = require('../../../contents')
const Permissions = require('../../middlewares/Permissions')

class PhoneCode {

    constructor () {



    }

    middlewares (permissions) {
        return [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            // restify.plugins.queryParser(), // req.query, req.params
            SYS.restifyWebServer.middlewares.formidable(),
            Permissions([
                ...permissions
            ], (req, res, next) => {
                res.send({
                    status: 'failed'

                })
            })
        ]
    }

    get (permissions) {

        return [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            // restify.plugins.queryParser(), // req.query, req.params
            Permissions([
                ...permissions
            ], (req, res, next) => {
                res.send({
                    status: 'failed'

                })
            }),
            async (req, res, next) => {
                if (req.session.checkPhoneCode) {
                    const now = Date.createDateTimeZone('Asia/Riyadh')


                    // check expires dead or not
                    if ((req.session.checkPhoneCode.expires - now.getTime()) > 0) {
                        res.send({
                            status: 'ok',
                            msg: 'Wait Phone Code',
                            code: 'WAIT_PHONE_CODE',
                            _code_debug: req.session.checkPhoneCode.code
                        })
                    } else {
                        res.send({
                            status: 'failed',
                            msg: 'No Phone Code',
                            code: 'NO_PHONE_CODE'
                        })
                    }


                } else {
                    res.send({
                        status: 'failed',
                        msg: 'No Phone Code',
                        code: 'NO_PHONE_CODE'
                    })
                }
            }
        ]




    }



    async post (req, res, next) {
        const now = Date.createDateTimeZone('Asia/Riyadh')

        if (!(req.session.checkPhoneCode && (req.session.checkPhoneCode.expires - now.getTime()) > 0)) {
            req.session.checkPhoneCode = undefined
            res.send({
                status: 'failed',
                msg: 'No Phone Code To Wait',
                code: 'NO_PHONE_CODE_TO_WAIT'
            })
            return next()
        }

        if (req.body.fields.phone_code)
            req.body.fields.phone_code = Number.parseInt(req.body.fields.phone_code, 10)


        if (!(typeof Number.parseInt(req.body.fields.phone_code, 10) === 'number' && req.body.fields.phone_code === req.session.checkPhoneCode.code)) {

            res.send({
                status: 'failed',
                msg: 'failed code',
                code: 'FAILED_CODE'
            })
            return next()

        }

        if (!(req.session.checkPhoneCode.type === 'ACCESS_BY_PHONE_NUMBER' || req.session.checkPhoneCode.type === 'ACCESS_BY_DEVICE_ID')) {
            req.session.checkPhoneCode = undefined
            res.send({
                status: 'failed',
                msg: 'unknow',
                code: 'UNKNOW'
            })
            return next()
        }








        req.session.db.user_id = req.session.checkPhoneCode.user_id
        req.session.db.role_id = req.session.checkPhoneCode.role_id

        req.session.checkPhoneCode = undefined

        res.send({
            status: 'ok',
            msg: 'successful access',
            code: 'SUCCESSFUL_ACCESS'
        })




        /* res.header('Content-Type', 'application/json')
        res.end(JSON.stringify({
            status: 'ok',
            msg: 'successful access',
            code: 'SUCCESSFUL_ACCESS'
        })) */



    }
}











module.exports = PhoneCode



