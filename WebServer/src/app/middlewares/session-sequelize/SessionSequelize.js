

const fs = require('fs')
const path = require('path')
const Op = require('sequelize').Op || {}


const EXPIRATION = 24 * 60 * 60
class SequelizeStoreException extends Error {
    constructor (message) {
        super(message)
        this.name = 'SequelizeStoreException'
    }
}


const defaultOptions = {

    timezone: 'Asia/Riyadh',

    expiration: 24 * 60 * 60 // The maximum age (in milliseconds) of a valid session. Used when cookie.expires is not set.
}










module.exports = function SequelizeSessionInit (Store) {
    class SequelizeStore extends Store {
        constructor (options) {
            super(options)

            if (typeof options !== 'undefined' && ({}).constructor === options.constructor) {
                this.options = options || {}
            } else
                this.options = {}


            this.options = (typeof options !== 'undefined' && ({}).constructor === options.constructor ? (options || {}) : {})


            if (!this.options.db) {
                // console.log('Database connection is required')
                throw new SequelizeStoreException('Database connection is required')
            }

            if (!this.options.timezone || typeof this.options.timezone) {
                this.options.timezone = defaultOptions.timezone
            }



            this.options.expiration = (typeof this.options.expiration === 'number' ? this.options.expiration : EXPIRATION)
            this.sessionModel = this.options.db.Session || this.options.db.models.Session








            // this.options = Object.assign(defaultOptions, this.options)
            // this.startExpiringSessions()
            // this.createProcedureGet()

        }


        static createEventRemoveAllExpiredSession (reCreate) {
            const dirname = __dirname
            const sql = fs.readFileSync(path.join(dirname + '/remove_all_session_expired.sql'), {
                encoding: 'utf8'
            })


            if (reCreate) {
                return SYS.mariadb.sequelize.query('drop EVENT if exists remove_all_session_expired', {
                    raw: true
                }).then((w) => {
                    console.log('SQL: init remove_all_session_expired EVENT')


                    return SYS.mariadb.sequelize.query(sql).then((_w) => {
                        return this
                    })
                })
            } else {
                console.log('SQL: init remove_all_session_expired EVENT')
                return SYS.mariadb.sequelize.query(sql).then((_w) => {

                    return this
                })
            }
        }

        static createProcedureGet (reCreate) {
            const dirname = __dirname
            // get the session and update last activity and check is Expired
            if (reCreate) {
                return SYS.mariadb.sequelize.query('drop PROCEDURE if exists session_get', { raw: true }).then((w) => {
                    console.log('SQL: init session_get PROCEDURE')
                    const sql = fs.readFileSync(path.join(dirname + '/get_session.sql'), {
                        encoding: 'utf8'
                    })
                    return SYS.mariadb.sequelize.query(sql).then((_w) => {
                        return this
                    })
                })
            } else
                return SYS.mariadb.sequelize.query("SHOW PROCEDURE STATUS WHERE name = 'session_get' ", { raw: true }).then((w) => {
                    if (w[0].length === 0) {
                        console.log('SQL: init session_get PROCEDURE')
                        const sql = fs.readFileSync(path.join(dirname + '/get_session.sql'), {
                            encoding: 'utf8'
                        })
                        return SYS.mariadb.sequelize.query(sql).then((_w) => {
                            return this
                        })
                    } else {

                        console.log('SQL: inited already session_get PROCEDURE :)')
                        return this
                    }

                })
        }

        static createProcedureSet (reCreate) {
            const dirname = __dirname
            // set if not exist TODO
            const sql = fs.readFileSync(path.join(dirname + '/set_session.sql'), {
                encoding: 'utf8'
            })
            if (reCreate) {
                return SYS.mariadb.sequelize.query('drop PROCEDURE if exists session_set', {
                    raw: true
                }).then((w) => {
                    console.log('SQL: init session_set PROCEDURE')

                    return SYS.mariadb.sequelize.query(sql).then((_w) => {
                        return this
                    })
                })
            } else
                return SYS.mariadb.sequelize.query("SHOW PROCEDURE STATUS WHERE name = 'session_set' ", {
                    raw: true
                }).then((w) => {
                    if (w[0].length === 0) {
                        console.log('SQL: init session_set PROCEDURE')
                        return SYS.mariadb.sequelize.query(sql).then((_w) => {
                            return this
                        })
                    } else {
                        console.log('SQL: inited already session_set PROCEDURE :)')
                        return this
                    }

                })




        }




        get (sid, fn) {
            const self = this




            return SYS.mariadb.sequelize.query('call session_get(:sid,:ttl,:in_now);', {
                raw: true,
                replacements: {
                    sid: sid,
                    ttl: 0, // for update experis after get a if 0 then not active :)
                    in_now: Date.createDateTimeZone(self.timezone) // toISOString()


                }
            }).then((dbData) => {

                if (dbData[0].isError === 1) {
                    return null
                } else { // todo try catch for string json convirter
                    const session = JSON.parse(dbData[0].data)


                    session.db = {
                        user_id: dbData[0].user_id,
                        role_id: dbData[0].role_id,
                        expires: dbData[0].expires,
                        lastActivity: dbData[0].last_activity,
                        // lastActivityForAllSession: dbData[0].last_activity_for_all_session,
                        // role_id_for_last_activity_for_all_session: dbData[0].role_id_for_last_activity_for_all_session,
                        created_at: dbData[0].created_at
                    }
                    // console.log(dbData[0])
                    return session

                }
            }).asCallback(fn)


        }

        set (sid, data, fn) {
            const self = this



            const expires = this._expiration(data)



            return SYS.mariadb.sequelize.query('call session_set(:sid,:data,:user_id,:role_id,:expires,:now);', {
                replacements: {
                    sid: sid,
                    user_id: ((data && data.db && data.db.user_id) ? data.db.user_id : null),
                    role_id: ((data && data.db && data.db.role_id) ? data.db.role_id : null),
                    expires: expires, // moment(expires).format("YYYY-MM-DD HH:mm:ss").toString(),
                    data: JSON.stringify(data),

                    now: Date.createDateTimeZone(self.timezone) // toISOString() //new Date().toISOString() // new Date(moment().utc().format('YYYY/MM/DD HH:mm:ss') + ' ' + this.options.gmt)

                },
                raw: true
            }).then((w) => {

                /*

				w[0]:resuilt
					{
						isError: 0,
						failed_args: 0,
						not_found: 0,
						failed_expires: 0,
						unknow: 0,
						user_id: null,
						data: "{'aa':555}",
						expires: 2020-03-05T22:29:05.000Z,
						last_activity: 2020-01-08T01:35:45.000Z,
						created_at: 2020-01-04T01:08:00.000Z
					}
          		*/
                const result = w[0]
                const session = {}
                if (result.isError === 1) {

                    return null
                } else {

                    session.data = JSON.stringify(result.data)
                    // session.expires = expires

                    return session
                }
            }).asCallback(fn)
        }


        // not actav the mysql evet working :) but i aybe i need code
        touch (sid, data, fn) {
            return fn()

            /* if (this.options.disableTouch) {

				return fn()
			}

			const expires = this.expiration(data)

			return this.sessionModel
				.update({ expires: expires }, { where: { sid: sid } })
				.then(function (rows) {
					return rows
				})
				.asCallback(fn) */
        }

        destroy (sid, fn) {

            // fn()
            // return null
            return this.sessionModel
                .findOne({ where: { sid: sid }, raw: false })
                .then(function foundSession (session) {
                    // If the session wasn't found, then consider it destroyed already.
                    if (session === null) {

                        return null
                    }
                    return session.destroy()
                })
                .asCallback(fn)
        }

        /* length (fn) {
			return this.sessionModel.count().asCallback(fn)
		} */

        _expiration (data) {

            if (data.cookie && data.cookie.expires) {
                return data.cookie.expires
            } else {
                // for debug catch never print i think :/
                console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
                return new Date(Date.createDateTimeZone(self.timezone).getTime() + this.options.expiration)

            }





        }





    }

    return SequelizeStore
}
