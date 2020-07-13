import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server'
import { Comment } from 'antd';
import L from 'leaflet'
import websocketURL from '../../socket/index'
import './MapContainer.scss';

export function MapContainer() {

    // const [map, setMap] = useState(null);

    // useEffect(() => {
    //     if (map == null) {
    //         setMap(L.map('map', {
    //             center: [0, 0],
    //             zoom: 2,
    //             layers: [
    //                 L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    //                     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //                 }),
    //             ]
    //         }));
    //     }
    // })

    // useEffect(() => {
    //     if (map != null) {
    //         const ws = new WebSocket(websocketURL + '/tweets?geolocated=true');
    //         ws.onmessage = (message) => {
    //             const tweet = JSON.parse(message.data);
    //             createMarker(tweet);
    //         }
    //     }

    // }, [map])

    // function createMarker(tweet) {
    //     if (tweet.position) {
    //         const marker = L.marker(tweet.position, {
    //             icon: markerIcon
    //         })
    //             .addTo(map)
    //             .bindPopup(createPopup(tweet))

    //         setTimeout(() => {
    //             marker.remove()
    //         }, 20000)
    //     }

    // }

    // function createPopup(tweet) {
    //     return ReactDOMServer.renderToString(
    //         <Comment
    //             author={tweet.userName}
    //             content={
    //                 <p>
    //                     {tweet.text}
    //                 </p>
    //             }
    //             datetime={tweet.date}
    //         />
    //     );
    // }

    return <div id="map"></div>
}