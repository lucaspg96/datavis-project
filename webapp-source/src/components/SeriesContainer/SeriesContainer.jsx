import React from 'react';
import './SeriesContainer.scss'
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import * as d3 from 'd3';
import * as dc from 'dc';
import { useState } from 'react';
import { useEffect } from 'react';
import websocketURL from '../../websocket';
import { Input, Spin } from 'antd';
import { Chart } from '@antv/g2';
import { isEmpty } from 'rambda';

const { Search } = Input;

export default function SeriesContainer() {

    const [addingWebsocket, setAddingWebsocket] = useState(false)
    const [chart, setChart] = useState();

    const colors = [
        "#1F77B4",
        "#FF7F0E",
        "#2CA02C",
        "#9467BD",
        "#E377C2",
    ];

    const takenColors = useRef([]);

    // const data = useRef(crossfilter([]));
    const data = useRef([])
    // const dimension = data.current.dimension(d => [d.key, d.date]).filterFunction(d => {
    //     const x = new Date().getTime() - d[1].getTime()
    //     // console.log(d[1], x)
    //     return x > 10000
    // })
    // const group = dimension.group().reduceSum(_ => 1)

    const [sockets, setSockets] = useState({})


    function addSocket(keyword = "") {
        setAddingWebsocket(true)

        const color = colors.filter(c => !takenColors.current.map(c => c[1]).includes(c))[0]
        takenColors.current.push([keyword, color])

        const ws =
            new WebSocket(websocketURL + '/tweets?keywords=' + encodeURIComponent(keyword))

        const newSockets = { ...sockets }
        newSockets[keyword] = {
            socket: ws,
            color
        }
        setSockets(newSockets)

        ws.onmessage = (message) => {
            const tweet = JSON.parse(message.data);
            const newData = [{ ...tweet, date: new Date(tweet.date), key: keyword }]
            data.current.push(newData[0])

        }

        ws.onopen = _ => setAddingWebsocket(false)


    }

    useEffect(() => {
        console.log(sockets)
        if (!isEmpty(sockets) && !chart) drawChart();
    }, [sockets])

    function getData() {
        const now = new Date().getTime()
        const cleanData = data.current.filter(d => now - d.date.getTime() < 60000)
        const facts = crossfilter(cleanData)
        const dimension = facts.dimension(d => [d.key, d.date])
        const group = dimension.group().reduceSum(_ => 1)

        return group.all()
            .map(d => ({ keyword: d.key[0], date: d.key[1].toLocaleTimeString(), value: d.value }))
    }

    function drawChart() {
        const chartData = getData()
        console.log(chartData, sockets)
        if (isEmpty(chartData))
            return setTimeout(drawChart, 2000)

        const chart = new Chart({
            container: 'series',
            autoFit: true,
            height: 500
        })


        console.log(chartData)
        chart.data(chartData)

        chart
            .line()
            .position('date*value')
            .color('keyword', k => {
                return takenColors.current.filter(c => c[0] === k)[0][1];
            })
        // .shape('smooth');

        chart.render()
        setChart(chart)

        function redraw() {
            const newChartData = getData()
            console.log(newChartData.length)
            chart.changeData(newChartData)
            setTimeout(redraw, 1000);
        }

        setTimeout(redraw, 1000)

    }

    return <>
        <Search onSearch={addSocket} />
        <Spin spinning={addingWebsocket}>
            <div id="series"></div>
        </Spin>

    </>
        ;

}