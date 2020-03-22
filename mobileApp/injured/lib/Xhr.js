







const HOST = 'http://192.168.1.7:3000'


class Xhr {

    constructor () {


        this.xhr = new XMLHttpRequest();
    }

    JSON_to_URLEncoded(element,key,list){
        var list = list || [];
        if(typeof(element)=='object'){
            for (var idx in element)
                this.JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
        } else {
            list.push(key+'='+encodeURIComponent(element));
        }
        return list.join('&');
    }



    isAccess () {

        return new Promise( (resolve,reject) => {


            this.xhr = new XMLHttpRequest();
            // this.xhr.readyState 1:Request started. , 2:Headers received. , 3:Data loading..! , 4:Request ended.
            this.xhr.onreadystatechange = e => {

                if (this.xhr.readyState !== 4)
                    return;

                if (this.xhr.status >= 200 && this.xhr.status < 300) {

                    let jsonRes = JSON.parse(this.xhr.responseText)
                    console.log(jsonRes)
                    if(jsonRes.status == 'ok')
                        resolve(true);
                    else
                        resolve(false);



                } else {
                    // If failed
                    reject({
                        status: this.xhr.status,
                        statusText: this.xhr.statusText,
                        responseText: this.xhr.responseText

                    });
                }
            }


            this.xhr.open('GET', HOST+'/api/isAccess/');
            this.xhr.withCredentials = true;
            this.xhr.send();

        })

    }

    access(id) {
        this.xhr = new XMLHttpRequest();
         return new Promise( (resolve,reject) => {

            this.xhr = new XMLHttpRequest();

            // this.xhr.readyState 1:Request started. , 2:Headers received. , 3:Data loading..! , 4:Request ended.
            this.xhr.onreadystatechange = e => {
                // console.log(this.xhr.readyState)
                if (this.xhr.readyState !== 4)
                    return;

                if (this.xhr.status >= 200 && this.xhr.status < 300) {

                    let jsonRes = JSON.parse(this.xhr.responseText)
                    // console.log(id,jsonRes)
                    if(jsonRes.status == 'ok')
                        resolve(true);
                    else
                        resolve(false);



                } else {
                    // If failed
                    reject({
                        status: this.xhr.status,
                        statusText: this.xhr.statusText
                    });
                }
            }


            this.xhr.open('POST', HOST+'/api/access/');
            this.xhr.withCredentials = true;
            // this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
            this.xhr.send(this.JSON_to_URLEncoded({
                device_id:id
            }));

        })

    }

    getAllEmergencies () {
        let self = this
        return new Promise( (resolve,reject) => {
            this.xhr = new XMLHttpRequest();


            // this.xhr.readyState 1:Request started. , 2:Headers received. , 3:Data loading..! , 4:Request ended.
            this.xhr.onreadystatechange = e => {

                if (this.xhr.readyState !== 4)
                    return;

                if (this.xhr.status >= 200 && this.xhr.status < 300) {

                    let jsonRes = JSON.parse(this.xhr.responseText)

                    if(jsonRes.status == 'ok')
                    {

                        resolve(jsonRes.emergencies);

                    }
                    else{
                        resolve([]);
                    }




                } else {
                    // If failed
                    reject({
                        status: this.xhr.status,
                        statusText: this.xhr.statusText
                    });
                }
            }


            this.xhr.open('GET', HOST+'/api/emergencies/?inc=paramedic');
            this.xhr.withCredentials = true;
            this.xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            this.xhr.send();

        })
    }

    /*

    title,
    description,
    lat,
    long,
    is_static
    */
    NewEmergency(data) {

        return new Promise( (resolve,reject) => {

            this.xhr = new XMLHttpRequest();

            // this.xhr.readyState 1:Request started. , 2:Headers received. , 3:Data loading..! , 4:Request ended.
            this.xhr.onreadystatechange = e => {
                // console.log(this.xhr.readyState)
                if (this.xhr.readyState !== 4)
                    return;

                if (this.xhr.status >= 200 && this.xhr.status < 300) {
                    // console.log('------->'+this.xhr.responseText)
                    let jsonRes = JSON.parse(this.xhr.responseText)

                    resolve(jsonRes);
                    /*if(jsonRes.status == 'ok')
                        resolve(jsonRes);
                    else
                        resolve(jsonRes);*/



                } else {
                    // If failed
                    reject({
                        status: this.xhr.status,
                        statusText: this.xhr.statusText
                    });
                }
            }


            this.xhr.open('POST', HOST+'/api/emergency/');
            this.xhr.withCredentials = true;
            // this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            //this.xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
            // console.log(data)
            this.xhr.send(JSON.stringify(data));





        })
    }

    updateEmergency(id, data) {

        return new Promise( (resolve,reject) => {

            this.xhr = new XMLHttpRequest();

            // this.xhr.readyState 1:Request started. , 2:Headers received. , 3:Data loading..! , 4:Request ended.
            this.xhr.onreadystatechange = e => {

                if (this.xhr.readyState !== 4)
                    return;

                if (this.xhr.status >= 200 && this.xhr.status < 300) {

                    let jsonRes = JSON.parse(this.xhr.responseText)

                    resolve(jsonRes);
                    /*if(jsonRes.status == 'ok')
                        resolve(jsonRes);
                    else
                        resolve(jsonRes);*/



                } else {
                    // If failed
                    reject({
                        status: this.xhr.status,
                        statusText: this.xhr.statusText
                    });
                }
            }


            this.xhr.open('PUT', HOST+'/api/emergency/'+id+'/');
            this.xhr.withCredentials = true;
            // this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            //this.xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );

            this.xhr.send(JSON.stringify(data));





        })
    }
}

let xhr =  new Xhr()




export default xhr;



