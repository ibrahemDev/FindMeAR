const cluster = require('cluster')



const Thread = require('./Thread')
const Logger = require('./Logger')
const RestifyWebServer = require('./RestifyWebServer')


module.exports = async (options) => {

    if (options.constructor !== ({}).constructor) {
        throw new Error('server without options can\'t work ')
    }



    const thread = new Thread(options)

    if (cluster.isMaster && thread.isRequired) {
        thread.init()
    } else {
        global.SYS = {}
        SYS.thread = thread
        SYS.ROOTPATH = process.cwd()
        SYS.isDebug = (typeof options.isDebug === 'boolean') ? options.isDebug : false
        SYS.TimeZone = (typeof options.TimeZone === 'string') ? options.TimeZone : 'Asia/Riyadh'
        SYS.logger = new Logger(options)
        SYS.logger.init()

        SYS.restifyWebServer = new RestifyWebServer(options)

        SYS.restifyWebServer.start()

        /* SYS.mariadb = new Mariadb()
        await SYS.mariadb.init()
        SYS.mariadb.start()
        await (async () => {
            await SequelizeStore.createProcedureGet(false)
            await SequelizeStore.createProcedureSet(false)
            await SequelizeStore.createEventRemoveAllExpiredSession(false)

        })()


        SYS.restify = new Restify() */



    }








}
