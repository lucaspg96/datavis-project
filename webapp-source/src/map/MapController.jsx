import { Comment } from 'antd';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server'
import React from 'react';

var map = null;

export function createMap(containerId) {
    if (map == null) {
        map = L.map(containerId, {
            center: [0, 0],
            zoom: 2,
            layers: [
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        })
    }
}

function createPopup(tweet) {

    const content = <Comment
        author={tweet.userName}
        content={
            <p>
                {tweet.text}
            </p>
        }
        datetime={tweet.date.toLocaleTimeString()}
    ></Comment>
    console.log(content)
    return ReactDOMServer.renderToString(
        content
    );
}

export function createMarker(tweet, duration = 20000) {
    if (tweet.position) {

        const marker = L.marker(tweet.position, {
            icon: L.divIcon({
                className: 'css-icon',
                html: `<div class="tweet-map-marker"
                style="background-color:${tweet.color}"></div>`
            })
        })
            .addTo(map)
            .bindPopup(createPopup(tweet))

        setTimeout(() => {
            marker.remove()
        }, duration)
    }

}