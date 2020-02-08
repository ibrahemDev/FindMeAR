
/**
  * // this method nnumber week of year  we need it for logs system
  * @returns Nunber //
  */
Date.prototype.getWeekNumber = function () {
    // TODO timezone BUG

    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()))
    var dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}


/**
 * // this method for format time
 * @param local String // like 'en-US' ar-SA etc...
 * @param timezone  String // like 'Asia/Riyadh'
 * @returns Object json // { year,month,day,hour,minute,second }
 */
Date.prototype.parserToLocaleString = function (local, timeZone) {
    const toLocaleString = this.toLocaleString((local || 'en-US'), {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
    // '02/03/2020, 12:12:59'
    const f = toLocaleString.split(',')
    const _date = f[0].split('/')
    const _time1 = f[1].split(' ')
    const _time = _time1[1].split(':')


    return {
        year: _date[2],
        month: _date[0],
        day: _date[1],
        hour: _time[0],
        minute: _time[1],
        second: _time[2]
    }

}


/**
 * this method return date with spesfec timezone
 *
 * @param timezone  String // like 'Asia/Riyadh'
 * @returns Date
 *
 */
Date.createDateTimeZone = (timeZone) => {
    const toISOString = function () {
        const r = new Date().parserToLocaleString('en-US', timeZone)
        return r.year + '-' + r.month + '-' + r.day + 'T' + r.hour + ':' + r.minute + ':' + r.second + '.000Z'
    }
    return new Date(toISOString())
}




const fs = require('fs')
const path = require('path')
const core = require('./core/Core')


core({ // global config
    isDebug: true,
    TimeZone: 'Asia/Riyadh',

    cluster: {
        isRequired: false,
        cpus: 2
    },
    webserver: {
        host: '127.0.0.1',
        port: 3000,
        trustProxy: true,
        httpVersion: '2.0', // http = 1.0 https=1.1 https/2 = 2.0
        ssl: { // if using https or https/2

            key: fs.readFileSync(path.join(__dirname, './data/ssl/localhost.privkey.pem'), {
                encoding: 'utf8'
            }),
            cert: fs.readFileSync(path.join(__dirname, './data/ssl/localhost.cert.pem'), {
                encoding: 'utf8'
            })
        },
        HttpToHttps: {
            isRequired: true,
            http: {
                port: 8081
            },
            https: {
                port: 3000
            }

        }
    },
    logger: {
        isRequired: true,
        dir: './logs/',
        newFileEvery: 5 // 5 = friday
    }

})




