import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server'
import { Comment } from 'antd';
import L from 'leaflet'
import websocketURL from '../../websocket'
import './MapContainer.scss';

const markerIcon = L.divIcon({
    className: 'css-icon',
    html: '<div class="tweet-map-marker"></div>'
});

export function MapContainer() {

    const [map, setMap] = useState(null);

    useEffect(() => {
        if (map == null) {
            setMap(L.map('map', {
                center: [0, 0],
                zoom: 2,
                layers: [
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    }),
                ]
            }));
        }
    })

    useEffect(() => {
        if (map != null) {
            const ws = new WebSocket(websocketURL + '/tweets?geolocated=true');
            ws.onmessage = (message) => {
                const tweet = JSON.parse(message.data);
                createMarker(tweet);
            }
        }

    }, [map])

    function createMarker(tweet) {
        L.marker([tweet.lat, tweet.lng], {
            icon: markerIcon
        })
            .addTo(map)
            .bindPopup(createPopup(tweet))
    }

    function createPopup(tweet) {
        return ReactDOMServer.renderToString(
            <Comment
                author={tweet.userName}
                content={
                    <p>
                        {tweet.text}
                    </p>
                }
                datetime={tweet.date}
            />
        );
    }

    return <div id="map"></div>
}