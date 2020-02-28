const Joi = require('@hapi/joi')
const contents = require('../../../contents')
const Permissions = require('../../middlewares/Permissions')



// new way to create route for test :/
/**
 *
 * put  /api/paramedic/emergencie/:id/
 *
 */

class ParamedicUpdateEmergencie {
    constructor () {

        this.joiForm = Joi.object({
            status_msg: Joi.string().empty().min(0).max(1000).label('status_msg'),
            status: Joi.number().label('is Static')
        }).min(2).label('Form')

        this.joiParams = Joi.object({
            id: Joi.number().required().positive().label('id')
        }).label('params')

        this.middlewares = [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            Permissions([
                contents.PERMISSIONS.PARAMEDIC
            ], (req, res, next) => {
                res.send({
                    status: 'failed',
                    message: 'Route Not Found',
                    code: 'ROUTE_NOT_FOUND'
                })
            }),
            SYS.restifyWebServer.middlewares.formidable()
        ]


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

        return validate.error
            ? this.buildUsefulErrorObject(validate.error.details)
            : null
    }

    async put (req, res, next) {
        const joiParams = this.joiCheck(this.joiParams, req.params)
        if (joiParams != null) {
            res.send({
                status: 'failed',
                error: {
                    params: joiParams
                }
            })
            return next()
        }

        const joiForm = this.joiCheck(this.joiForm, req.body.fields)

        if (joiForm != null) {
            res.send({
                status: 'failed',
                error: {
                    form: joiForm
                }
            })
            return next()
        }

        const jsonUpdate = {}

        for (var key in req.body.fields) {
            jsonUpdate[key] = req.body.fields[key]
        }

        const emergency = await SYS.mariadb.models.get('Emergency').update(jsonUpdate, {
            where: {
                id: +req.params.id,
                employee_id: req.session.db.user_id,
                status: 1
            }
        })

        if (emergency[0] === 1) {
            res.send({
                status: 'ok',
                msg: 'emergencie updated'
            })

        } else {
            res.send({
                status: 'failed',
                msg: 'emergencie not found to update' // database error
            })
        }

    }
}

module.exports = ParamedicUpdateEmergencie
