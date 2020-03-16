




module.exports = (options) => {
    const opts = ((options && {}.constructor === options.constructor) ? options : {}) || {}
    const disconnectionFn = (req, res, next) => {
        next()
    }
    const onDisconnection = (opts.onDisconnection && typeof opts.onDisconnection === 'function' ? opts.onDisconnection : disconnectionFn) || disconnectionFn

    return (req, res, next) => {


        SYS.mariadb.sequelize.authenticate()
            .then(() => {
                req.isDisconnection = false
                next()
            })
            .catch(err => {
                req.isDisconnection = true
                onDisconnection(req, res, next, err)

            })




    }
}
