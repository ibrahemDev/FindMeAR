const restify = require('restify')
const Joi = require('@hapi/joi')
const contents = require('../../../contents')
const Permissions = require('../../middlewares/Permissions')





class Access {

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
        if (methodType === 'post') {
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
        } else if (methodType === 'get') {
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
        }
    }

    /**
     *
     * @param {*} min
     * @param {*} max
     */
    random (min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    // /api/isAccess/
    getIsAccess (req, res, next) {
        const isGuest = this.isPermission(contents.PERMISSIONS.GUEST, req)

        res.send({
            status: (isGuest) ? 'failed' : 'ok'
        })
    }


    // /api/access/
    async post (req, res, next) {

        const JoiForm = Joi.object({
            device_id: Joi.string().alphanum().min(30).max(255).label('device id'),
            phone_number: Joi.string().min(9).max(9).pattern(new RegExp('^5[0-9]{8}$')).label('Phone number'),
            type: Joi.string().valid('injured', 'paramedic', 'admin').label('type')

        }).and('phone_number', 'type').or('phone_number', 'device_id').without('phone_number', ['device_id']).without('device_id', ['phone_number', 'type']).with('type', 'phone_number').label('Form')


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

        if (validateJoiForm.value.device_id) {
            const [user, isUserCreatedNow] = await SYS.mariadb.models.get('Users').findOrCreate({

                where: { device_id: validateJoiForm.value.device_id },
                defaults: {
                    device_id: validateJoiForm.value.device_id
                }
            })


            const [RoleUser, isRoleUserCreated] = await SYS.mariadb.models.get('RoleUser').findOrCreate({

                where: { role_id: contents.PERMISSIONS.INJURED, user_id: user.dataValues.id },
                defaults: {
                    role_id: contents.PERMISSIONS.INJURED,
                    user_id: user.dataValues.id
                }
            })





            if (!isUserCreatedNow && typeof user.dataValues.phone_number === 'number') {
                const randomCode = this.random(100000, 999999) // Math.floor(Math.random() * 999999)
                const expires = new Date(Date.createDateTimeZone('Asia/Riyadh').getTime() + 1000 * 60 * 10).getTime() // 10 min


                req.session.checkPhoneCode = {
                    type: 'ACCESS_BY_DEVICE_ID',
                    code: randomCode,
                    expires: expires,
                    user_id: user.dataValues.id,
                    role_id: contents.PERMISSIONS.INJURED
                }

                // send check your phone sms and put the code
                res.send({
                    status: 'ok',
                    code: 'CHECK_PHONE_SMS'
                })
                return next()
            } else {
                if (!req.session.db)
                    req.session.db = {}
                req.session.db.user_id = user.dataValues.id
                req.session.db.role_id = contents.PERMISSIONS.INJURED


                // send we create user

                res.send({
                    status: 'ok',
                    code: 'SUCCESSFUL_ACCESS'
                })
                return next()

            }

        }



        if (validateJoiForm.value.phone_number) {
            const randomCode = this.random(100000, 999999) // Math.floor(Math.random() * 999999)
            const expires = new Date(Date.createDateTimeZone('Asia/Riyadh').getTime() + 1000 * 60 * 10).getTime() // 10 min

            const user = await SYS.mariadb.models.get('Users').findOne({
                where: {
                    phone_number: validateJoiForm.value.phone_number


                },
                include: [
                    {
                        model: SYS.mariadb.models.get('Roles'),
                        as: 'roles',
                        where: {
                            id: contents.PERMISSIONS[validateJoiForm.value.type.toUpperCase()]
                        }
                    }
                ]
            })





            if (user == null) {
                res.send({
                    status: 'failed',
                    code: 'FAILED_ROLE'
                })
            } else {
                req.session.checkPhoneCode = {
                    type: 'ACCESS_BY_PHONE_NUMBER',
                    code: randomCode,
                    expires: expires,
                    user_id: user.dataValues.id,
                    role_id: contents.PERMISSIONS[validateJoiForm.value.type.toUpperCase()]
                }


                res.send({
                    status: 'ok',
                    code: 'CHECK_PHONE_SMS'
                })
            }



            return next()

        }
    }
}







module.exports = Access








