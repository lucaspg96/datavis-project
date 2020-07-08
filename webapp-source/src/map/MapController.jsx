import { Comment } from 'antd';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server'
import React from 'react';
import * as d3 from 'd3';

var map = null;
var dataWithoutPosition = 0;
var legend = undefined;
var markersLayer = undefined

export function createMap(containerId) {
    map = L.map(containerId, {
        center: [0, 0],
        zoom: 1,
        layers: [
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }),
        ]
    })

}

export function getMap() {
    return map;
}

export function getMarkersLayer() {
    return markersLayer;
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
    return ReactDOMServer.renderToString(
        content
    );
}

export function clearMarkers() {
    if (markersLayer) markersLayer.clearLayers()
    dataWithoutPosition = 0;
}

export function createMarker(tweet) {

    if (!markersLayer) {
        markersLayer = L.layerGroup().addTo(map)
    }

    const marker = L.marker(tweet.position, {
        icon: L.divIcon({
            className: 'css-icon',
            html: `<div class="tweet-map-marker"
            style="background-color:${tweet.color}"></div>`
        })
    })
        .bindPopup(createPopup(tweet))

    marker.id = tweet.id

    return marker

}

export function addMarker(tweet, duration = 20000, staticMap = false) {

    if (!markersLayer) {
        markersLayer = L.layerGroup().addTo(map)
    }

    if (tweet.position) {
        const marker = createMarker(tweet)
            .addTo(markersLayer)


        if (!staticMap) {
            setTimeout(() => {
                marker.remove()
            }, duration)
        }
    }
    else {
        dataWithoutPosition += 1
        updateLegend()
    }
}

function updateLegend() {
    const text = (dataWithoutPosition > 1) ? `${dataWithoutPosition} tweets sem localização` : `${dataWithoutPosition} tweet sem localização`;
    if (legend) {
        if (dataWithoutPosition === 0) legend.remove()
        else d3.select(".map-legend")
            .text(text)
    }
    else {
        legend = L.control({ position: 'bottomright' });
        legend.onAdd = map => {
            const div = L.DomUtil.create("div", "map-legend")
            div.innerHTML += text

            return div
        }

        legend.addTo(map)
    }
}