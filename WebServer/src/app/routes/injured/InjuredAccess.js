const Joi = require('@hapi/joi')
const formidable = require('formidable')


// SequelizeStore

/**
 *
 */
class InjuredAccess {

    /**
     *  describe what happened here
     */
    constructor () {
        const self = this



        SYS.restifyWebServer.httpsServer.post('/api/injured/access/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl({
                type: 'add', // add slash last url
                statusCode: 301, // this for redirect
                skip: false, //
                methods: 'get,head', // work with this methods
                beforeRedirect: () => {
                    // log
                }
            }),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest({
                onDisconnection: (req, res, next, err) => {

                    res.send({
                        status: 'failed',
                        message: 'Connection to Database'
                    })
                }
            }),
            (req, res, next) => {

                (SYS.sequelizeStore) ? SYS.restifyWebServer.middlewares.session({
                    secret: 'keyboard cat',
                    name: 'sess',
                    resave: true,
                    saveUninitialized: true,
                    cookie: {
                        secure: true,
                        expires: new Date(Date.createDateTimeZone('Asia/Riyadh').getTime() + 1000 * 60 * 60 * 24 * 5)
                    },
                    store: SYS.sequelizeStore

                })(req, res, next) : next()
            },
            (req, res, next) => {
                const form = formidable({ multiples: false })

                form.parse(req, (err, fields, files) => {
                    if (err) {
                        next(err)

                    } else {
                        req.body = { fields, files }
                        next()
                    }

                })


            },
            // SYS.restifyWebServer.middlewares.bodyParser.urlencoded({ extended: false }),
            this._post.bind(self)
        ])



        this.JoiObject = Joi.object({
            device_id: Joi.string().alphanum().min(30).max(255).label('device id'),
            phone_number: Joi.string().min(9).max(9).pattern(new RegExp('^5[0-9]{8}$')).label('Phone number')
        }).or('phone_number', 'device_id').without('phone_number', ['device_id']).label('Form')




    }

    /**
     *
     * @param {*} schema
     * @param {*} data
     */
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

    /**
     *
     * @param {*} min
     * @param {*} max
     */
    random (min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    /**
     *
     * @param {*} req
     * @param {*} phoneNumber
     */
    async accessByPhoneNumber (req, phoneNumber) {
        const randomCode = this.random(100000, 999999) // Math.floor(Math.random() * 999999)
        const expires = new Date(Date.createDateTimeZone('Asia/Riyadh').getTime() + 1000 * 60 * 10).getTime() // 10 min
        const user = await SYS.mariadb.models.get('Users').findOne({
            where: {
                phone_number: Number.parseInt(phoneNumber, 10)
            }
        })

        if (user == null) {
            return {
                phoneCode: false,
                user_undefind: true
            }
        } else {
            req.session.checkPhoneCode = {
                type: 'ACCESS_BY_PHONE_NUMBER',
                code: randomCode,
                expires: expires,
                user_id: user.dataValues.id,
                role_id: 2 // injured
            }
            return {
                phoneCode: true,
                user_undefind: false

            }
        }



    }


    /**
     *
     * @param {*} req
     * @param {*} deviceId
     */
    async accessByDeviceId (req, deviceId) {


        const [user, isUserCreated] = await SYS.mariadb.models.get('Users').findOrCreate({

            where: { device_id: deviceId },
            defaults: {
                device_id: deviceId
            }
        })


        const [RoleUser, isRoleUserCreated] = await SYS.mariadb.models.get('RoleUser').findOrCreate({

            where: { role_id: 2, user_id: user.dataValues.id },
            defaults: {
                role_id: 2,
                user_id: user.dataValues.id
            }
        })

        if (!isUserCreated && typeof user.dataValues.phone_number === 'number') {
            const randomCode = this.random(100000, 999999) // Math.floor(Math.random() * 999999)
            const expires = new Date(Date.createDateTimeZone('Asia/Riyadh').getTime() + 1000 * 60 * 10).getTime() // 10 min


            req.session.checkPhoneCode = {
                type: 'ACCESS_BY_DEVICE_ID',
                code: randomCode,
                expires: expires,
                user_id: user.dataValues.id,
                role_id: RoleUser.dataValues.role_id
            }

            return {
                phoneCode: true,
                isAccess: false
            }
        } else {
            if (!req.session.db)
                req.session.db = {}
            req.session.db.user_id = user.dataValues.id
            req.session.db.role_id = RoleUser.dataValues.role_id

            return {
                phoneCode: false,
                isAccess: true
            }
        }



    }




    /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async _post (req, res, next) {


        if (req.session.db && typeof req.session.db.user_id === 'number') {
            res.send({
                status: 'failed',
                msg: 'Already Access',
                code: 'ALREADY_ACCESS'
            })
        } else {
            const validate = this.joiParseErrors(this.JoiObject, req.body.fields)

            if (validate != null) {
                const arr = []
                validate.forEach((item) => {
                    var cache = {

                        lable: item.context.label,
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


                if (req.body.fields.device_id) {
                    const access = await this.accessByDeviceId(req, req.body.fields.device_id)


                    if (access.isAccess) {
                        res.send({
                            status: 'ok',
                            msg: 'successful access'
                        })
                    } else {
                        res.send({
                            status: 'ok',
                            msg: 'wait phone code'
                        })
                    }
                } else if (req.body.fields.phone_number) {

                    const access = await this.accessByPhoneNumber(req, req.body.fields.phone_number)

                    res.send({
                        status: 'ok',
                        msg: 'wait phone code'
                    })
                } else {
                    res.send({
                        status: 'failed',
                        errors: {
                            unkonw: {
                                msg: 'unknow',
                                code: 'UNKNOW'
                            }
                        }
                    })
                }


            }



        }

        // console.log(req.session)

    }
}


module.exports = InjuredAccess
