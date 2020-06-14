import React from 'react';
import './SeriesContainer.scss'
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Input, Spin, Tag } from 'antd';
import { Chart } from '@antv/g2';
import { isEmpty } from 'rambda';
import * as SocketController from '../../socket/SocketController';
import * as MapController from '../../map/MapController';

const { Search } = Input;

const graphRedrawRate = 1000

export default function SeriesContainer() {

    const [chart, setChart] = useState();
    const [search, setSearch] = useState("");

    const colors = [
        "#1F77B4",
        "#FF7F0E",
        "#2CA02C",
        "#9467BD",
        "#E377C2",
    ];

    const [takenColors, setTakenColors] = useState([]);

    const data = useRef([])

    function addSocket(keyword = "") {
        setSearch("")
        const color = colors.filter(c => !takenColors.map(c => c[1]).includes(c))[0]
        setTakenColors([...takenColors, [keyword, color]])
        SocketController.addSocket({ keyword, color })
    }

    useEffect(() => {
        // series chart listener to collect all tweets
        MapController.createMap("map");

        SocketController.addListenner("time", ({ color, key, date }) => {
            data.current.push({ color, key, date })
        });

        SocketController.addListenner("map", tweet => {
            MapController.createMarker(tweet)
        });
    })

    useEffect(() => {
        if (!isEmpty(takenColors)) {
            if (chart) chart.destroy()
            drawChart();
        }
    }, [takenColors])

    function getData() {
        if (isEmpty(data.current)) {
            return []
        }


        const now = data.current[data.current.length - 1].date.getTime() - 1000
        const cleanData = data.current.filter(d => d.date.getTime() < now &&
            now - d.date.getTime() < 60000)
        const facts = crossfilter(cleanData)
        const dimension = facts.dimension(d => [d.key, d.date])
        const group = dimension.group().reduceSum(_ => 1)

        return group.all()
            .sort((a, b) => a.key[1] < b.key[1])
            .map(d => ({ keyword: d.key[0], date: d.key[1].toLocaleTimeString(), value: d.value }))
    }

    function drawChart() {
        const chartData = getData()
        if (isEmpty(chartData))
            return setTimeout(drawChart, graphRedrawRate)

        const chart = new Chart({
            container: 'series',
            autoFit: true,
            height: 200
        })

        chart.data(chartData)

        chart
            .line()
            .position('date*value')
            .color('keyword', k => {
                console.log(takenColors)
                return takenColors.filter(c => c[0] === k)[0][1];
            })
        // .shape('smooth');

        chart.render()
        setChart(chart)

        function redraw() {
            const newChartData = getData()
            console.log(newChartData.length)
            chart.changeData(newChartData)
            setTimeout(redraw, graphRedrawRate);
        }

        setTimeout(redraw, graphRedrawRate)

    }

    return <div className="main-container">
        <div className="tweets-search-container">
            <Search
                onSearch={addSocket}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="tweets-search" />
            <div className="tags-container">
                {takenColors.map(([tag, color]) => <Tag color={color}>{tag}</Tag>)}
            </div>
        </div>

        <div className="series-container">
            <div id="series"></div>
        </div>

        <div className="map-container">
            <div id="map"></div>
        </div >

    </div >
        ;

}