const Joi = require('@hapi/joi')
const { Op } = require('sequelize')

const restify = require('restify')







// SequelizeStore

class AdminAddUserRole {

    /**
     *  describe what happened here
     */
    constructor () {
        const self = this



        SYS.restifyWebServer.httpsServer.post('/api/admin/user/:id/addRole/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            // check is login or not
            (req, res, next) => {

                if (req.session.db && req.session.db.user_id && req.session.db.role_id === 1) {
                    next()
                } else {

                    res.send({
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })

                }
            },
            restify.plugins.queryParser({ mapParams: false }),
            this._post.bind(self)
        ])



        this.JoiObjectParams = Joi.object({
            id: Joi.number().required().positive().label('id')
        }).label('Form')

        this.JoiObjectForm = Joi.object({
            role_id: Joi.number().required().positive().less(4).label('Role id')
        }).label('Form')




    }

    joiParseErrors (schema, data) {

        var errors = schema.validate(data, { abortEarly: false })

        const buildUsefulErrorObject = (errors) => {
            const usefulErrors = []
            errors.map((error) => {
                usefulErrors.push(error)
            })
            return usefulErrors
        }



        return errors.error
            ? buildUsefulErrorObject(errors.error.details)
            : null
    }

    async _post (req, res, next) {
        const self = this
        const v = this.JoiObjectParams.validate(req.params, { abortEarly: false })
        if (v.error != null) {
            res.send({
                status: 'failed',
                msg: 'id error'
            })
            return
        }



        const validate = this.joiParseErrors(this.JoiObjectForm, req.body.fields)
        if (validate != null) {
            const arr = []
            validate.forEach((item) => {

                var cache = {

                    ...item.context,
                    msg: item.message,
                    code: item.type

                }
                arr.push(cache)
            })


            res.send({
                status: 'failed',
                msg: 'form error',
                code: 'FORM_ERROR',
                form: arr

            })
        } else {

            let isExists = await SYS.mariadb.models.get('Users').count({
                where: {
                    id: req.params.id
                }
            })
            isExists = Boolean(isExists)

            if (isExists) {
                const [roleUser, isUserCreated] = await SYS.mariadb.models.get('RoleUser').findOrCreate({

                    where: {
                        user_id: req.params.id,
                        role_id: req.body.fields.role_id
                    },
                    defaults: {
                        user_id: req.params.id,
                        role_id: req.body.fields.role_id
                    }
                })

                res.send({
                    status: 'ok',
                    msg: 'successful',
                    code: 'SUCCESSFUL'
                })
            } else {
                res.send({
                    status: 'failed',
                    msg: 'user not found',
                    code: 'USER_NOT_FOUND'
                })
            }



        }
    }
}


module.exports = AdminAddUserRole
