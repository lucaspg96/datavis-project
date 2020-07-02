import { websocketURL } from './index';

const sockets = {}
const listenners = {}

export function addListenner(key, listenner) {
    listenners[key] = listenner;
}

export function addSocket({ keyword, color }) {

    const ws =
        new WebSocket(websocketURL + '/tweets?keywords=' + encodeURIComponent(keyword))

    sockets[keyword] = ws

    ws.onmessage = (message) => {
        const tweet = JSON.parse(message.data);
        const newData = { ...tweet, date: new Date(tweet.date), key: keyword, color }
        Object.entries(listenners).forEach(([_, f]) => f(newData))

    }

}

export function removeSocket(keyword) {
    const ws = sockets[keyword];
    ws.close(3000);
    delete sockets[keyword];
}