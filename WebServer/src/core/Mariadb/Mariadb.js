const Sequelize = require('sequelize')
const decamelize = require('decamelize')
const mariadb = require('mariadb/callback')


const Users = require('./models/users')
const _Session = require('./models/session')
const Roles = require('./models/roles')
const RoleUser = require('./models/role_user')
const Emergency = require('./models/Emergency')
const LocationInArea = require('./models/LocationInArea')
const Area = require('./models/Area')



// const SessionOptions = require('./models/SessionOptions')
// const PermissionRole = require('./models/permission_role')
// const Permissions = require('./models/permissions')



class Mariadb {

    constructor (options) {

        if (!(options.Mariadb && options.Mariadb.constructor === ({}).constructor)) {
            options.Mariadb = {}
        }
        options = options.Mariadb


        this.db_host = (typeof options.db_host === 'string') ? options.db_host : '127.0.0.1'
        this.db_name = (typeof options.db_name === 'string') ? options.db_name : 'db_' + Math.floor(Math.random() * 100000000000000)

        this.db_user = (typeof options.db_user === 'string') ? options.db_user : 'root'
        this.db_pass = (typeof options.db_pass === 'string') ? options.db_pass : ''
        this.logging = (typeof options.logging === 'boolean') ? options.logging : false
        this.db_timezone = (typeof options.db_timezone === 'string') ? options.db_timezone : 'Etc/GMT+0'
        this.db_pool = null

        if (options.db_pool && options.db_pool.constructor === ({}).constructor) {
            this.db_pool = options.db_pool
        }





        this.sequelize = null
        this.models = new Map([])
        this.isDatabaseCreated = false
        this.isSequelizeSync = false


        console.log(this)


    }

    async init () {

        await this.connection()

    }

    async connection () {
        const self = this
        return new Promise((resolve) => {

            this.sequelize = new Sequelize(this.db_name, this.db_user, this.db_pass, {
                host: this.db_host,
                dialect: 'mariadb', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
                dialectOptions: {
                    collate: 'utf8mb4_general_ci',
                    useUTC: false,
                    timezone: this.db_timezone
                },
                logging: this.logging || false,
                pool: this.db_pool,
                timezone: this.db_timezone
            })




            /**
             * to change camile case to _
             *
             * decamelize('unicornRainbow');
                //=> 'unicorn_rainbow'

                decamelize('unicornRainbow', '-');
                //=> 'unicorn-rainbow'
            */
            this.sequelize.addHook('beforeDefine', (attributes, options) => {
                Object.keys(attributes).forEach((key) => {
                    if (typeof attributes[key] !== 'function') {
                        attributes[key].field = decamelize(key)
                    }
                })
            })






            this.models.set('Users', Users(this.sequelize, Sequelize))
            this.models.set('Session', _Session(this.sequelize, Sequelize))
            this.models.set('RoleUser', RoleUser(this.sequelize, Sequelize))
            this.models.set('Roles', Roles(this.sequelize, Sequelize))
            this.models.set('Emergency', Emergency(this.sequelize, Sequelize))
            this.models.set('Area', Area(this.sequelize, Sequelize))
            this.models.set('LocationInArea', LocationInArea(this.sequelize, Sequelize))




            resolve()

        })


    }



    // to start create tables and make relation chip from models
    async start (timeOut) {

        const self = this
        return new Promise((resolve) => {




            for (var model of this.models) {
                model[1].associate(this.models)
            }
            let conn
            let stop = false
            if (typeof timeOut === 'number' && timeOut !== 0) {
                setTimeout(() => {
                    if (!this.isDatabaseCreated && !this.isSequelizeSync) {
                        stop = true
                        console.log('ERROR CONNECT TO DATABASE')
                        resolve()
                    }
                }, timeOut)
            }
            const initDatabaseAndTabels = (time) => {
                if (stop) {

                    return
                }

                if (conn && conn.isValid()) {
                    if (!this.isDatabaseCreated) {
                        console.log('Createing Database if not Exists')
                        conn.query('CREATE DATABASE IF NOT EXISTS ' + this.db_name, (err, rows) => {
                            if (err) {


                                conn.end()
                                setTimeout(() => {
                                    initDatabaseAndTabels(5000)
                                }, time)
                            } else {
                                console.log('Successful create database')
                                this.isDatabaseCreated = true
                                initDatabaseAndTabels(5000)
                            }
                        })
                    } else if (!this.isSequelizeSync) {
                        console.log('Createing tables & relations')
                        this.sequelize.sync({ force: false })
                        console.log('Successful create tables & relations')
                        this.isSequelizeSync = true
                        resolve()

                    }
                } else {

                    conn = mariadb.createConnection({ host: self.db_host, user: self.db_user, password: self.db_pass, connectTimeout: 3000 })
                    conn.connect(err => {
                        if (err)
                            setTimeout(() => {
                                initDatabaseAndTabels(5000)
                            }, time)
                        else {
                            console.log('Successful Connection')
                            initDatabaseAndTabels(5000)
                        }

                    })

                }
            }
            console.log('Database Start Connecting')
            initDatabaseAndTabels(5000)
        })
    }
}


module.exports = Mariadb

