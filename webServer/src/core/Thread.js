const cluster = require('cluster')
const os = require('os')


const workers = []




class Thread {
    constructor (options) {
        if (options.cluster && options.cluster.constructor === ({}).constructor) {

            this.isRequired = (typeof options.cluster.isRequired === 'boolean') ? options.cluster.isRequired : false
            this.cpus = (this.isRequired)
                ? (typeof options.cluster.cpus === 'number') ? options.cluster.cpus : os.cpus().length
                : null




        } else {
            this.isRequired = false
            this.cpus = null
        }



        this.workers = []




    }

    init () {

        if (this.isRequired) {
            this.startFork()
        } else
            throw new Error('Why u init Thread and it is nit Required')


    }


    startFork () {

        for (let i = 0; i < this.cpus; i++) {

            // creating workers and pushing reference in an array
            // these references can be used to receive messages from workers
            this.workers.push(cluster.fork())

            // to receive messages from worker process
            this.workers[i].on('message', function (message) {
                //console.log(message)
            })
        }
        cluster.on('online', function (worker) {
           // console.log('Worker ' + worker.process.pid + ' is listening')
        })
        cluster.on('exit', function (worker, code, signal) {
            //console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
            //console.log('Starting a new worker')
            // cluster.fork();
            workers.push(cluster.fork())
            // to receive messages from worker process
            workers[workers.length - 1].on('message', function (message) {
                //console.log(message)
            })
        })

        // process is clustered on a core and process id is assigned
        /* cluster.on('online', function (worker) {
			console.log('Worker ' + worker.process.pid + ' is listening')
		})

		// if any of the worker process dies then start a new one by simply forking another one
		cluster.on('exit', function (worker, code, signal) {
			console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
			console.log('Starting a new worker')
			// cluster.fork()
			// workers.push(cluster.fork())
			// to receive messages from worker process
			workers[workers.length - 1].on('message', function (message) {
				console.log(message)
			})
		}) */
    }
}




module.exports = Thread
