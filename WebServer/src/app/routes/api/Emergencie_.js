const contents = require('../../../contents')
const Permissions = require('../../middlewares/Permissions')
const restify = require('restify')
const Joi = require('@hapi/joi')
const { Op } = require("sequelize");



class Emergencie {

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












    // INJURED only
    async post (req, res, next) {

        const isParamedic = this.isPermission(contents.PERMISSIONS.PARAMEDIC, req)
        const isAdmin = this.isPermission(contents.PERMISSIONS.ADMIN, req)

        const s = {
            title: Joi.string().empty().min(0).max(255).required().label('Title'),
            description: Joi.string().empty().min(0).max(1000).required().label('Description'),
            lat: Joi.number().required().label('Lat'),
            long: Joi.number().required().label('Long'),
            is_static: Joi.boolean().required().label('is Static')
        }
        if (isAdmin) {
            s['createdAt'] = Joi.string().default(null).label('createdAt')
        }
        const JoiForm = Joi.object(s).label('Form')




        const validateJoiParams = this.joiCheck(JoiForm, req.body.fields)
        if (validateJoiParams.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    Form: validateJoiParams.errors
                }
            })
            return next()
        }
        console.log(new Date(validateJoiParams.value.createdAt).toISOString())
        const Emergency = await SYS.mariadb.models.get('Emergency').create({
            user_id: req.session.db.user_id,
            employee_id: null,
            title: validateJoiParams.value.title,
            description: validateJoiParams.value.description,
            lat: validateJoiParams.value.lat,
            long: validateJoiParams.value.long,
            is_static: validateJoiParams.value.is_static,
            status: 1, // 1 == live , 2 == close
            status_msg: 'no respone',
            createdAt: (isAdmin) ? new Date(validateJoiParams.value.createdAt).toISOString() : null
        })

        res.send({
            status: 'ok',
            msg: 'Emergency created',
            Emergency: Emergency
        })

    }

    // postMany () {}
    // not need it
    delete () {}

    // deleteAll () {}
    // INJURED and PARAMEDIC only
    // /api/emergencie/:id/
    async putById (req, res, next) {
        const isInjured = this.isPermission(contents.PERMISSIONS.INJURED, req)
        const isParamedic = this.isPermission(contents.PERMISSIONS.PARAMEDIC, req)


        let JoiForm = null
        const where = {
            status: 1
        }

        const joiParams = Joi.object({
            id: Joi.number().required().positive().label('id')
        }).label('params')
        const validateJoiParams = this.joiCheck(joiParams, req.params)
        if (validateJoiParams.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    params: validateJoiParams.errors
                }
            })
            return next()
        }


        if (isInjured) {
            where.id = validateJoiParams.value.id
            where.user_id = req.session.db.user_id

            JoiForm = Joi.object({
                title: Joi.string().empty().min(0).max(255).label('Title'),
                description: Joi.string().empty().min(0).max(1000).label('Description'),
                lat: Joi.number().label('Lat'),
                long: Joi.number().label('Long'),
                is_static: Joi.boolean().label('is Static')
            }).min(2).label('Form')
        } else if (isParamedic) {
            where.id = validateJoiParams.value.id
            where.employee_id = req.session.db.user_id




            JoiForm = Joi.object({
                status_msg: Joi.string().empty().min(0).max(1000).label('status_msg'),
                status: Joi.number().label('is Static')
            }).min(2).label('Form')

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



        const emergency = await SYS.mariadb.models.get('Emergency').update(jsonUpdate, {
            where: where
        })

        res.send({
            status: (emergency[0] === 1) ? 'ok' : 'failed'
        })





    }

    // putAll () {}

    /**
     *  /api/emergencie/:id/
     *
     *
     */

    /*

    */
    async getById (req, res, next) {
        const isInjured = this.isPermission(contents.PERMISSIONS.INJURED, req)
        const isParamedic = this.isPermission(contents.PERMISSIONS.PARAMEDIC, req)
        const isAdmin = this.isPermission(contents.PERMISSIONS.ADMIN, req)
        const userAttr = ['id', 'phone_number', 'full_name', 'last_update']


        const listAttr = ['id', 'user_id', 'employee_id', 'title', 'description', 'lat', 'long', 'is_static', 'status_msg', 'status', 'created_at']
        const listInc = (isAdmin) ? ['injured', 'paramedic'] : ((isParamedic) ? ['injured'] : ((isInjured) ? ['paramedic'] : []))



        const joiParams = Joi.object({
            id: Joi.number().required().positive().label('id')
        }).label('params')
        const validateJoiParams = this.joiCheck(joiParams, req.params)
        if (validateJoiParams.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    params: validateJoiParams.errors
                }
            })
            return next()
        }




        const joiQuery = Joi.object({
            status: Joi.number().min(1).max(2).label('status'),
            attr: Joi.string().label('attr'),
            inc: Joi.string().label('inc')
        }).label('queries')
        const validateJoiQuery = this.joiCheck(joiQuery, req.query)
        if (validateJoiQuery.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    query: validateJoiQuery.errors
                }
            })
            return next()
        }

        const dbObj = {
            where: {
                id: validateJoiParams.value.id
            }
        }











        if (isInjured) {

            dbObj.where.user_id = req.session.db.user_id
        } else if (isParamedic) {



            dbObj.where.employee_id = req.session.db.user_id

            if (validateJoiQuery.value.status) {
                dbObj.where.status = validateJoiQuery.value.status
            }



        }


        let attr = ''
        if (req.query.attr)
            attr = this.attrParser(req.query.attr, listAttr, ',')

        const attrs = attr.split(',')

        if (attrs.length && attr !== '')
            dbObj.attributes = attrs




        let inc = ''
        if (req.query.inc)
            inc = this.attrParser(req.query.inc, listInc, ',')
        const incs = inc.split(',')

        if (incs.length && inc !== '') {
            dbObj.include = []

            for (var key in incs) {



                dbObj.include.push({
                    model: SYS.mariadb.models.get('Users'),
                    attributes: userAttr,
                    as: incs[key]
                })
            }

        }



        const emergencie = await SYS.mariadb.models.get('Emergency').findOne(dbObj)




        res.send({
            status: 'ok',
            emergencie: emergencie

        })







    }

    /**
    * this work for paramidce only
     *  /api/emergencie/
     *
     *
     */
    async get (req, res, next) {

        const isInjured = this.isPermission(contents.PERMISSIONS.INJURED, req)
        const isParamedic = this.isPermission(contents.PERMISSIONS.PARAMEDIC, req)
        const isAdmin = this.isPermission(contents.PERMISSIONS.ADMIN, req)

        const userAttr = ['id', 'phone_number', 'full_name', 'last_update']
        const listAttr = ['id', 'user_id', 'employee_id', 'title', 'description', 'lat', 'long', 'is_static', 'status_msg', 'status', 'created_at']
        const listInc = ['injured']




        const joiQuery = Joi.object({
            status: Joi.number().min(1).max(2).label('status'),
            attr: Joi.string().label('attr'),
            inc: Joi.string().label('inc')
        }).label('queries')
        const validateJoiQuery = this.joiCheck(joiQuery, req.query)
        if (validateJoiQuery.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    query: validateJoiQuery.errors
                }
            })
            return next()
        }

        const dbObj = {
            where: {
                status: 1,
                employee_id: req.session.db.user_id

            }
        }

        let attr = ''
        if (req.query.attr)
            attr = this.attrParser(req.query.attr, listAttr, ',')

        const attrs = attr.split(',')

        if (attrs.length && attr !== '')
            dbObj.attributes = attrs




        let inc = ''
        if (req.query.inc)
            inc = this.attrParser(req.query.inc, listInc, ',')
        const incs = inc.split(',')

        if (incs.length && inc !== '') {
            dbObj.include = []

            for (var key in incs) {


                dbObj.include.push({
                    model: SYS.mariadb.models.get('Users'),
                    attributes: userAttr,
                    as: incs[key]
                })
            }

        }









        if (validateJoiQuery.value.status) {
            dbObj.where.status = validateJoiQuery.value.status
        }









        const emergencie = await SYS.mariadb.models.get('Emergency').findOne(dbObj)




        res.send({
            status: 'ok',
            emergencie: emergencie

        })







    }

    /**
     *  /api/emergencies/
     *
     *
     */
    async getAll (req, res, next) {
        const isInjured = this.isPermission(contents.PERMISSIONS.INJURED, req)
        const isParamedic = this.isPermission(contents.PERMISSIONS.PARAMEDIC, req)
        const isAdmin = this.isPermission(contents.PERMISSIONS.ADMIN, req)
        const userAttr = ['id', 'phone_number', 'full_name', 'last_update']


        const listAttr = ['id', 'user_id', 'employee_id', 'title', 'description', 'lat', 'long', 'is_static', 'status_msg', 'status', 'created_at']
        const listInc = (isAdmin) ? ['injured', 'paramedic'] : ((isParamedic) ? ['injured'] : ((isInjured) ? ['paramedic'] : []))







        const joiQuery = Joi.object({
            status: Joi.number().min(1).max(2).label('status'),
            attr: Joi.string().label('attr'),
            inc: Joi.string().label('inc')
        }).label('queries')
        const validateJoiQuery = this.joiCheck(joiQuery, req.query)
        if (validateJoiQuery.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    query: validateJoiQuery.errors
                }
            })
            return next()
        }

        const dbObj = {
            where: {

            }
        }











        if (isInjured) {

            dbObj.where.user_id = req.session.db.user_id
        } else if (isParamedic) {



            dbObj.where.employee_id = req.session.db.user_id
            if (validateJoiQuery.value.status) {
                dbObj.where.status = validateJoiQuery.value.status
            }

            if (validateJoiQuery.value.inc) {}

        }


        let attr = ''
        if (req.query.attr)
            attr = this.attrParser(req.query.attr, listAttr, ',')

        const attrs = attr.split(',')

        if (attrs.length && attr !== '')
            dbObj.attributes = attrs




        let inc = ''
        if (req.query.inc)
            inc = this.attrParser(req.query.inc, listInc, ',')
        const incs = inc.split(',')

        if (incs.length && inc !== '') {
            dbObj.include = []

            for (var key in incs) {


                dbObj.include.push({
                    model: SYS.mariadb.models.get('Users'),
                    attributes: userAttr,
                    as: incs[key]
                })
            }

        }




        const emergencies = await SYS.mariadb.models.get('Emergency').findAll(dbObj)




        res.send({
            status: 'ok',
            emergencies: emergencies

        })


    }

    async getAll2Date (req, res, next) {








        const joiQuery = Joi.object({
            date1: Joi.string().label('date1'),
            date2: Joi.string().label('date2')
        }).label('queries')

        const validateJoiQuery = this.joiCheck(joiQuery, req.query)
        if (validateJoiQuery.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    query: validateJoiQuery.errors
                }
            })
            return next()
        }

        const dbObj = {
            where: {

                created_at: {
                    [Op.between]: [validateJoiQuery.value.date1, validateJoiQuery.value.date2]
                }
            }
        }



        const emergencies = await SYS.mariadb.models.get('Emergency').findAll(dbObj)




        res.send({
            status: 'ok',
            emergencies: emergencies

        })


    }


}




module.exports = Emergencie
