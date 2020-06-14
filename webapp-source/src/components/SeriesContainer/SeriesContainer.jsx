import React from 'react';
import './SeriesContainer.scss'
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Input, Spin, Tag, PageHeader } from 'antd';
import { Chart } from '@antv/g2';
import { isEmpty } from 'rambda';
import * as SocketController from '../../socket/SocketController';
import * as MapController from '../../map/MapController';

const { Search } = Input;

const graphRedrawRate = 1500
const timeWindowSize = 1 * 60 * 1000

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
        data.current.splice(0, data.current.length)
        if (chart) chart.destroy()
        if (!isEmpty(takenColors)) {
            drawChart();
        }
    }, [takenColors])

    function getData() {
        if (isEmpty(data.current)) {
            return []
        }

        const now = data.current[data.current.length - 1].date.getTime() - 1000
        const cleanData = data.current.filter(d => d.date.getTime() < now &&
            now - d.date.getTime() < timeWindowSize)
        const facts = crossfilter(cleanData)
        const dimension = facts.dimension(d => [d.key, d.date])
        const group = dimension.group().reduceSum(_ => 1)

        return group.all()
            .sort((a, b) => a.key[1] < b.key[1])
            .map(d => ({ keyword: d.key[0], date: d.key[1].toLocaleTimeString(), value: d.value }))
    }

    function handleRemove(tag) {
        SocketController.removeSocket(tag)
        if (takenColors.length === 1) chart.destroy();
        setTakenColors(takenColors.filter(c => c[0] !== tag))
    }

    function drawChart() {
        const chartData = getData()
        if (isEmpty(chartData))
            return setTimeout(drawChart, graphRedrawRate)

        const chart = new Chart({
            container: 'series',
            autoFit: true,
            height: 200,
            renderer: 'svg'
        })

        chart.data(chartData)

        chart
            .line()
            .position('date*value')
            .color('keyword', k => {
                return (takenColors.filter(c => c[0] === k)[0] || [1, "rgba(0,0,0,0)"])[1];
            })
            .label(false)
        // .shape('smooth');

        chart.render()
        setChart(chart)

        function redraw() {
            const newChartData = getData()
            chart.changeData(newChartData)
            setTimeout(redraw, graphRedrawRate);
        }

        setTimeout(redraw, graphRedrawRate)

    }

    return <div className="main-container">
        <PageHeader title="Tweets monitor" subTitle="Monitore assuntos em tempo real (ou quase isso)">
            <div className="tweets-search-container">

                <Search
                    placeholder="Entre um tema"
                    onSearch={addSocket}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="tweets-search" />
                <div className="tags-container">
                    {takenColors.map(([tag, color]) =>
                        <Tag
                            key={tag}
                            closable={true}
                            color={color}
                            onClose={_ => handleRemove(tag)}
                        >
                            {tag}
                        </Tag>
                    )
                    }
                </div>
            </div>
        </PageHeader>

        <div className="series-container">
            <div id="series"></div>
        </div>

        <div className="map-container">
            <div id="map"></div>
        </div >

    </div >
        ;

}