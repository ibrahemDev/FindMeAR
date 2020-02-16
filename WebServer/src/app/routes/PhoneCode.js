const Joi = require('@hapi/joi')
const formidable = require('formidable')


// SequelizeStore

/**
 *
 */
class PhoneCode {
    constructor () {
        const self = this

        SYS.restifyWebServer.httpsServer.get('/api/phone_code/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            this._get.bind(self)
        ])

        SYS.restifyWebServer.httpsServer.post('/api/phone_code/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            this._post.bind(self)
        ])
    }





    async _get (req, res, next) {


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

    async _post (req, res, next) {
        const now = Date.createDateTimeZone('Asia/Riyadh')
        if (req.session.checkPhoneCode && (req.session.checkPhoneCode.expires - now.getTime()) > 0) {
            if (req.body.fields.phone_code)
                req.body.fields.phone_code = Number.parseInt(req.body.fields.phone_code, 10)


            if (typeof Number.parseInt(req.body.fields.phone_code, 10) === 'number' && req.body.fields.phone_code === req.session.checkPhoneCode.code) {

                if (req.session.checkPhoneCode.type === 'ACCESS_BY_PHONE_NUMBER' || req.session.checkPhoneCode.type === 'ACCESS_BY_DEVICE_ID') {

                    req.session.db.user_id = req.session.checkPhoneCode.user_id
                    req.session.db.role_id = req.session.checkPhoneCode.role_id

                    req.session.checkPhoneCode = undefined
                    res.send({
                        status: 'ok',
                        msg: 'successful access',
                        code: 'SUCCESSFUL_ACCESS'
                    })



                } else {
                    req.session.checkPhoneCode = undefined
                    res.send({
                        status: 'failed',
                        msg: 'unknow',
                        code: 'UNKNOW'
                    })
                }
            } else {

                res.send({
                    status: 'failed',
                    msg: 'failed code',
                    code: 'FAILED_CODE'
                })
            }

        } else {
            req.session.checkPhoneCode = undefined
            res.send({
                status: 'failed',
                msg: 'No Phone Code To Wait',
                code: 'NO_PHONE_CODE_TO_WAIT'
            })
        }
    }

}


module.exports = PhoneCode
