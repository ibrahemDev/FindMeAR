const contents = require('../../../contents')
const Permissions = require('../../middlewares/Permissions')
const restify = require('restify')
const Joi = require('@hapi/joi')

class Account {
    constructor () {

    }

    middlewares (methodType, permissions) {
        if (methodType === 'get') {
            return [
                SYS.restifyWebServer.middlewares.OptimizeUrl(),
                SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
                SYS.restifyWebServer.middlewares.session(),
                // SYS.restifyWebServer.middlewares.formidable(),
                Permissions([
                    ...permissions
                ], (req, res, next) => {
                    res.send({
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })
                })

            ]
        } else if (methodType === 'put') {
            return [
                SYS.restifyWebServer.middlewares.OptimizeUrl(),
                SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
                SYS.restifyWebServer.middlewares.session(),

                SYS.restifyWebServer.middlewares.formidable(),
                Permissions([
                    ...permissions
                ], (req, res, next) => {
                    res.send({
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })
                })

            ]
        }
    }

    buildUsefulErrorObject (errors) {
        const usefulErrors = []
        errors.map((error) => {
            usefulErrors.push(error)
        })
        return usefulErrors
    }

    joiCheck (schema, data) {
        const validate = schema.validate(data, { abortEarly: false })
        const obj2 = {}
        obj2.errors = validate.error ? this.buildUsefulErrorObject(validate.error.details) : null
        obj2.value = validate.value
        return obj2
    }

    isPermission (permission, req) {
        if (permission === contents.PERMISSIONS.GUEST && req.session.db && req.session.db.user_id == null) {
            return true
        } else if (req.session.db && req.session.db.user_id && req.session.db.role_id === permission) {
            return true
        } else {
            return false
        }
    }

    async putSelf (req, res, next) {
        const isInjured = this.isPermission(contents.PERMISSIONS.INJURED, req)
        const isParamedic = this.isPermission(contents.PERMISSIONS.PARAMEDIC, req)
        const isAdmin = this.isPermission(contents.PERMISSIONS.ADMIN, req)
        let JoiForm


        const where = {
            id: req.session.db.user_id
        }



        if (isInjured) {
            JoiForm = Joi.object({
                phone_number: Joi.string().min(9).max(9).pattern(new RegExp('^5[0-9]{8}$')).label('Phone number'),
                full_name: Joi.string().empty().min(0).max(255).label('full_name'),
                lat: Joi.number().label('Lat'),
                long: Joi.number().label('Long')
            }).min(1).label('Form')
        } else if (isParamedic) {
            JoiForm = Joi.object({
                phone_number: Joi.string().min(9).max(9).pattern(new RegExp('^5[0-9]{8}$')).label('Phone number'),
                full_name: Joi.string().empty().min(0).max(255).label('full_name'),
                lat: Joi.number().label('Lat'),
                long: Joi.number().label('Long'),
                is_busy: Joi.boolean().label('is busy')
            }).min(1).label('Form')
        } else if (isAdmin) {
            JoiForm = Joi.object({
                device_id: Joi.string().alphanum().min(30).max(255).label('device id'),
                phone_number: Joi.string().min(9).max(9).pattern(new RegExp('^5[0-9]{8}$')).label('Phone number'),
                full_name: Joi.string().empty().min(0).max(255).label('full_name'),
                lat: Joi.number().label('Lat'),
                long: Joi.number().label('Long'),
                is_busy: Joi.boolean().label('is busy')
            }).min(1).label('Form')

        }

        const validateJoiForm = this.joiCheck(JoiForm, req.body.fields)
        if (validateJoiForm.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    Form: validateJoiForm.errors
                }
            })
            return next()
        }

        const jsonUpdate = {}

        for (var key in validateJoiForm.value) {

            if (key !== 'id')
                jsonUpdate[key] = validateJoiForm.value[key]
        }

        const user = await SYS.mariadb.models.get('Users').update(jsonUpdate, {
            where: where
        })

        res.send({
            status: (user[0] === 1) ? 'ok' : 'failed'
        })


    }

    async get (req, res, next) {
        const isInjured = this.isPermission(contents.PERMISSIONS.INJURED, req)
        const isParamedic = this.isPermission(contents.PERMISSIONS.PARAMEDIC, req)
        const isAdmin = this.isPermission(contents.PERMISSIONS.ADMIN, req)
        let attr
        if (isInjured) {
            attr = ['phone_number', 'full_name', 'lat', 'long']

        } else if (isParamedic) {
            attr = ['phone_number', 'full_name', 'lat', 'long', 'is_busy']

        } else if (isAdmin) {
            attr = ['device_id', 'phone_number', 'full_name', 'lat', 'long', 'is_busy']
        }
        const user = await SYS.mariadb.models.get('Users').findOne({
            attributes: attr,
            where: {
                id: req.session.db.user_id

            }
        })
        res.send({
            status: (user !== null) ? 'ok' : 'failed',
            user: user
        })

    }
}









module.exports = Account
