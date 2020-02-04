/**
 *  update javascript here :)
 *
 *
 *
 *
 *
 *
 *
 *
 */




 /**
  *
  *
  * update Date for fix timezone :/
  *
  *
  */
Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()))
    var dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
Date.prototype.parserToLocaleString = function (local, timeZone) {
    let toLocaleString = this.toLocaleString((local || 'en-US'), {
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
    let f = toLocaleString.split(',')
    let _date = f[0].split('/')
    let _time1 = f[1].split(' ')
    let _time = _time1[1].split(':')


    return {
        year: _date[2],
        month: _date[0],
        day: _date[1],
        hour: _time[0],
        minute: _time[1],
        second: _time[2]
    }

}
Date.createDateTimeZone = (timeZone) => {
    const toISOString = function () {
        let r = new Date().parserToLocaleString('en-US', timeZone)
        return r.year + '-' + r.month + '-' + r.day + 'T' + r.hour + ':' + r.minute + ':' + r.second + '.000Z'
    }
    return new Date(toISOString())
}

/**
 *
 *
 *
 * ########################################################################################################################
 */


const core = require('./core/Core')






core({
    isDebug: true,
    TimeZone: 'Asia/Riyadh',

    cluster:{
        isRequired:true,
        cpus:2
    }
})




