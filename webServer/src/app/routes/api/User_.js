const contents = require('../../../contents')
const Permissions = require('../../middlewares/Permissions')
const restify = require('restify')
const Joi = require('@hapi/joi')






class User {

    constructor () {

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


    middlewares (methodType, permissions) {
        if (methodType === 'get') {
            return [
                SYS.restifyWebServer.middlewares.OptimizeUrl(),
                SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
                SYS.restifyWebServer.middlewares.session(),
                restify.plugins.queryParser(), // req.query, req.params
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
        } else if (methodType === 'post') {
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
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })
                })

            ]
        } else if (methodType === 'put') {

        } else if (methodType === 'delete') {

        }
    }



    // attrParser('a,b,c,d', ['a','b'], ',')
    attrParser (attr, inc, by) {
        const split = attr.split(by)
        const last = []
        for (var key in split) {
            for (var key2 in inc) {
                if (split[key] === inc[key2])
                    last.push(inc[key2])
            }
        }

        return last.join(by)
    }





//  id, device_id, phone_number, full_name, is_busy, lat, long, last_update, created_at, deleted_at
    async getUserById () {
        const isInjured = this.isPermission(contents.PERMISSIONS.INJURED, req)
        const isParamedic = this.isPermission(contents.PERMISSIONS.PARAMEDIC, req)
        const isAdmin = this.isPermission(contents.PERMISSIONS.ADMIN, req)




        const userAttr = (isInjured) ? ['id', 'phone_number', 'full_name'] : (
            (isParamedic) ? ['id', 'phone_number', 'full_name'] : (
                // for admin
                ['id', 'device_id', 'phone_number', 'full_name', 'is_busy', 'lat', 'long', 'last_update', 'created_at', 'deleted_at']
            )
        )




        // ['id', 'phone_number', 'full_name', 'last_update']


        const listAttr = ['id', 'user_id', 'employee_id', 'title', 'description', 'lat', 'long', 'is_static', 'status_msg', 'status', 'created_at']
        const listInc = (isParamedic) ? ['Emergency'] : ((isInjured) ? ['Emergency'] : [])
        const incWhere = (isParamedic) ? {
            user_id:
        } : ((isInjured) ? ['Emergency'] : [])






    }


    async getAllUsers () {

    }

    async putRole () {

    }

    async deleteRole () {

    }









}



module.exports = User
