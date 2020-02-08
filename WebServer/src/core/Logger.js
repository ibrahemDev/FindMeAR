const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf } = format
const path = require('path')

class Logger {
    constructor (options) {

        if (options.logger && options.logger.constructor === ({}).constructor) {

            this.isRequired = (typeof options.logger.isRequired === 'boolean') ? options.logger.isRequired : false

            this.dir = (typeof options.logger.dir === 'string') ? options.logger.dir : './logs/'

            this.newFileEvery = (typeof options.logger.newFileEvery === 'number') ? options.logger.newFileEvery : 5

        } else
            this.isRequired = false


        this.System = null
        this.Http = null
    }

    init () {
        const self = this

        self.setLogger('System', format.combine(
            // format.colorize(),
            format.label({ label: 'System' }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            format.printf(info => {
                return `(${info.timestamp}) [${info.label} - ${info.level}]   ${info.message}`
            })
        ))

        self.setLogger('Http', format.combine(
            // format.colorize(),
            format.label({ label: 'Http' }),

            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            format.printf(info => {
                return `(${info.timestamp}) [${info.label} - ${info.level}]   ${info.message}`
            })
        ))

        /* return new Promise((resolve) => {	resolve()
		}) */
    }

    setLogger (name, format) {
        const self = this
        const now = Date.createDateTimeZone(SYS.TimeZone) // new Date()




        if (this[name]) {


            this[name].log.close()
            if (this[name].timeOut)
                clearTimeout(this[name].timeOut)

            this[name].log = undefined
            this[name].timeOut = undefined
            this[name].loggerStream = undefined

            this[name] = undefined
        }
        this[name] = { log: null, timeOut: null, loggerStream: null }
        this[name].log = createLogger({
            format: format,
            transports: [
                new transports.File({

                    filename: path.join(self.dir, './logs/' + now.getFullYear() + '/' + name + '/' + now.getWeekNumber() + '-logs.log'),
                    json: false,
                    colorize: false,
                    maxsize: 5242880,
                    maxFiles: 5
                })
                // new transports.Console(),
            ]
        })

        // if(QSYS.IS_DEBUG){
        this[name].log.add(new transports.Console({
            level: 'info',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true
        }))


        // }

        this[name].loggerStream = {
            write: message => self[name].log.info(message.substring(0, message.lastIndexOf('\n')))
            // info: message => self[name].log.info(message.substring(0, message.lastIndexOf('\n')))
        }



        const dayOfWeek = 5 // friday for create new log file every friday
        const _now = Date.createDateTimeZone(SYS.TimeZone)// new Date()
        // _now.setHours(_now.getHours() + 3)// greenwich +3 QSYS.greenwichHour



        const date = Date.createDateTimeZone(SYS.TimeZone) // new Date()
        // date.setHours(date.getHours() + 3)

        date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7)
        date.setHours(24 + 3, 0, 0, 0)

        if ((date.getTime() - _now.getTime()) <= (1000 * 60 * 60 * 24 * 7)) {
            const dif = date.getTime() - _now.getTime()
            this[name].timeOut = setTimeout(function () {
                self[name].log.close()
                self[name].log = undefined
                self[name].timeOut = undefined
                self[name].loggerStream = undefined
                self[name] = undefined
                self.setLogger(name, format)
            }, dif)
        }

    }

}

module.exports = Logger
