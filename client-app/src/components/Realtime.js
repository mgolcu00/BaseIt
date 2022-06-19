import axios from "axios";

export class RealtimeDatabaseReferance {
    constructor(ref, url) {
        this.ref = ref;
        if (url) {
            this.url = url;
        }
    }
    sse = null
    session_id = null;


    listen(callback) {
        if (!this.sse) {
            this.sse = new EventSource([this.url + 'listen'], { withCredentials: true });
        }
        this.sse.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data != null) {
                console.log(data);
                this.session_id = data.session_id || this.session_id;
                if (this.ref = '*') {
                    callback(null, data.data);
                } else {
                    callback(null, data.data[this.ref]);
                }
            } else {
                callback({ error: 'no data' }, null);
            }
        }
        this.sse.onerror = (error) => {
            callback(error, null);
        }
        this.sse.onopen = (event) => {
            console.log('sse.onopen', event);
        }
        this.sse.addEventListener('close', (event) => {
            console.log('sse.close', event);
        });
    }



    close() {
        axios.post(this.url + 'stop', { id: this.session_id })
        this.sse.close();
    }

    push(data) {
        return axios.post(this.url + 'data', { data: data });
    }

}
export class RealtimeDatabaseClient {
    referances = [];
    url = 'http://localhost:8000/api/realtime/';
    constructor(url) {
        if (url) {
            this.url = url;
        }
    }

    ref(ref) {
        if (this.referances.find(r => r.ref == ref)) {
            return this.referances.find(r => r.ref == ref);
        }
        const r = new RealtimeDatabaseReferance(ref, this.url);
        this.referances.push(r);
        return r;
    }
    close() {
        this.referances.forEach(ref => {
            console.log('close', ref);
            ref.close();
        })
    }
}
