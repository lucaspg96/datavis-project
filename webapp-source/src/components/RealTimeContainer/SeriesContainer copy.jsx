import React from 'react';
import './SeriesContainer.scss'
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import * as d3 from 'd3';
import * as dc from 'dc';
import { useState } from 'react';
import { useEffect } from 'react';
import websocketURL from '../../websocket';
import { Input } from 'antd';
import { cross } from 'd3';

const { Search } = Input;

export default function SeriesContainer() {

    const allFacts = useRef(crossfilter([]));
    const allDimension = allFacts.current.dimension(d => d.date.getTime())

    const [timeDimension, x] = useState(allFacts.current.dimension(d => d.date.getTime()))
    // const [timeDimension, x] = useState(facts.current.dimension(d => d.date))
    // const [timeCountGroup, y] = useState(timeDimension.group());

    const [sockets, setSockets] = useState({})

    const [chartsProperties, setChartsProperties] = useState([])

    function addSocket(keyword = "") {
        console.log(keyword)
        const facts = crossfilter([])
        const ws =
            new WebSocket(websocketURL + '/tweets?keywords=' + encodeURIComponent(keyword))
        ws.onmessage = (message) => {
            const tweet = JSON.parse(message.data);
            const newData = [{ ...tweet, date: new Date(tweet.date), key: keyword }]
            allFacts.current.add(newData)
            facts.add(newData)
            // console.log(timeCountGroup.all())
        }

        const dimension = facts.dimension(d => [d.key, d.date.getTime()])
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
        console.log({ dimension, group, key })
        return dc.lineChart(composite)
            .dimension(dimension)
            .group(group, key)
            .colorCalculator(_ => "blue")

    }

    function drawChart() {

        const xScale = d3
            .scaleTime()

        // const chart = new dc.SeriesChart("#series")
        const chart = dc.compositeChart("#series")
        // const chart = dc.lineChart("#series")
        chart
            // .chart(function (c) { return new dc.LineChart(c).curve(d3.curveCardinal); })
            // .seriesAccessor(function (d) { return d.key[0]; })
            // .keyAccessor(function (d) { return d.key[1]; })
            // .valueAccessor(function (d) { return d.value; })
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
            // if (chartsProperties[0]) console.log(chartsProperties[0].group.all())
            if (allDimension.bottom(1)[0]) {
                console.log(chart, [allDimension.bottom(1)[0].date.getTime(), allDimension.top(1)[0].date.getTime()])
                chart.x(d3
                    .scaleTime()
                    .domain([allDimension.bottom(1)[0].date.getTime(), allDimension.top(1)[0].date.getTime()])
                )
            }


            setTimeout(_ => dc.redrawAll(), 1000)
        });

        dc.renderAll();
        dc.redrawAll();

    }

    return <>
        <Search onSearch={addSocket} />
        <div id="series"></div>
    </>
        ;

}