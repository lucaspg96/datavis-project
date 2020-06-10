import React from 'react';
import './SeriesContainer.scss'
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import * as d3 from 'd3';
import * as dc from 'dc';
import { useState } from 'react';
import { useEffect } from 'react';
import websocketURL from '../../websocket';

export default function SeriesContainer() {

    const facts = useRef(crossfilter([]));

    // const timeDimension = facts.current.dimension(d => [d.key, d.date])
    const timeDimension = facts.current.dimension(d => d.date)
    const timeCountGroup = timeDimension.group()//.reduceSum(_ => 1)

    const [sockets, setSockets] = useState({})

    const [chartsProperties, setChartsProperties] = useState([])

    function addSocket(keyword = "") {
        const ws =
            new WebSocket(websocketURL + '/tweets?keywords=' + encodeURIComponent(keyword))
        ws.onmessage = (message) => {
            const tweet = JSON.parse(message.data);
            facts.current.add([{ ...tweet, date: new Date(tweet.date), key: keyword }])
        }

        const dimension = facts.current.dimension(d => d.date)
            .filter(d => d.key === keyword)
        const group = dimension.group()//.reduceSum(_ => 1)

        setChartsProperties([...chartsProperties, {
            key: keyword,
            dimension,
            group
        }])

        setSockets({ keyword: ws })
    }

    useEffect(() => {
        addSocket("netflix")

    }, [])

    useEffect(() => {
        drawChart()

    }, [chartsProperties])

    function generateChart(composite, { dimension, group, key }) {

        return dc.lineChart(composite)
            .dimension(dimension)
            .group(group, key)

    }

    function drawChart() {

        const xScale = d3.scaleTime()
            .domain([new Date(), new Date()])

        console.log(chartsProperties)

        const chart = new dc.CompositeChart("#series")
        chart
            .compose(chartsProperties.map(props => generateChart(chart, props)))
            .width(768)
            .height(480)
            .x(xScale)
            .elasticX(true)
            .elasticY(true)
            .brushOn(false)
        // .clipPadding(10)
        // .dimension(timeDimension)
        // .group(timeCountGroup)
        // .colors(['blue'])
        // .colorAccessor(d => 0);


        chart.on('renderlet', function (chart) {
            d3.selectAll('.line')
                .style('fill', 'none')
        })

        chart.on("postRedraw", _ => {
            console.log("postRedraw")
            setTimeout(_ => dc.redrawAll(), 1000)
        });
        console.log("draw")
        dc.renderAll();
        dc.redrawAll();

    }

    return <div id="series"></div>;

}