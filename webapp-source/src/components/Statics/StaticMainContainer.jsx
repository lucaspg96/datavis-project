import React from 'react';
import { Input, PageHeader, Row, Col, Card } from 'antd';
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chart } from '@antv/g2';
import { groupBy, map } from 'lodash';
import * as d3 from "d3";
import _ from 'lodash';

import * as MapController from '../../map/MapController';
import './StaticMainContainer.scss';

// import data from './data.json';
import TweetsStatistics from '../RealTimeContainer/TweetsStatistics';
import TwitterService from '../../services/TwitterService';
import { barChart } from 'dc';

const { Search } = Input;

export function StaticMainContainer() {

    const [data, setData] = useState();

    const [selectedKeys, setSelectedKeys] = useState([])
    const keyFilter = t => selectedKeys.length === 0 || selectedKeys.includes(t.key)

    const [barChart, setBarChart] = useState()
    const [seriesChart, setSeriesChart] = useState()

    const filteredData = (data || []).filter(keyFilter)

    const colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]

    const [statistics, setStatistics] = useState({});
    const metrics = useRef({ users: new Set() })
    const [coloredKeys, setColors] = useState([]);

    useEffect(() => {
        /** Backend's Request to get historical tweets*/
        TwitterService.find().then(data => {
            data.forEach(d => d.date = new Date(Number(d.date.$numberLong)));
            setData(addColorToData(data))
        })
    }, [])

    useEffect(() => {
        if (data) init();
    }, [data])

    useEffect(() => {
        MapController.clearMarkers()
        draw()
    }, [selectedKeys])

    //** Initializations */
    function init() {
        MapController.createMap("map");
        draw();
    }

    function draw() {

        if (barChart) barChart.destroy()
        if (seriesChart) seriesChart.destroy()

        if (data) {
            drawBarChart();
            drawSeriesChart();
            configStats();
            addMarkers();
        }

    }

    /**
     * 
     * ###########  Draw Charts  ###########
     * 
    */

    /** Bar Chart */
    function drawBarChart() {

        const barChart = new Chart({
            container: 'bar',
            autoFit: true,
            height: 300,
            renderer: 'svg'
        });


        const barData = getBarData();

        barChart.data(barData);
        barChart.coordinate('rect').transpose();
        barChart.legend(true);
        barChart.tooltip(true);
        barChart.interval()
            .position('key*value')
            .color('key', key => coloredKeys[key])

        barChart.on("click", e => {
            const { key } = e.data.data

            if (selectedKeys.includes(key)) setSelectedKeys(selectedKeys.filter(k => k != key))
            else setSelectedKeys([...selectedKeys, key])
        })

        barChart.render();        
        setBarChart(barChart)
    }

    /** Series Chart */
    function drawSeriesChart() {

        const chartData = getSeriesData();
        const seriesChart = new Chart({
            container: 'series',
            autoFit: true,
            height: 200,
            renderer: 'svg'
        })

        seriesChart.data(chartData)

        seriesChart
            .line()
            .position('date*value')
            .color('color', color => color)
            .label(false)

        seriesChart.axis('date', {
            animateOption: {
                update: {
                    duration: 1000,
                    easing: 'easeLinear'
                }
            }
        });

        seriesChart.render();
        setSeriesChart(seriesChart)
    }

    /**
     * 
     * ###########  Processing Data  ###########
     * 
    */


    /** Process data to Bar Chart */
    function getBarData() {
        const groupedData = _(filteredData)
            .groupBy(tweet => tweet.key)
            .map(tweet => _.merge({
                key: tweet[0].key,
                value: tweet.length
            }))
            .value();

        attachColor(groupedData);

        return _.sortBy(groupedData, tweets => tweets.value);
    }

    /** Process data to Series Chart */
    function getSeriesData() {
        const facts = crossfilter(filteredData)
        const dimension = facts.dimension(d => [d.key, d.date, d.color])
        const group = dimension.group().reduceSum(_ => 1)

        const seriesData = group.all()
            .sort((a, b) => a.key[1] < b.key[1])
            .map(d => ({ keyword: d.key[0], date: new Date(d.key[1]).toLocaleString(), color: d.key[2], value: d.value }))
        return seriesData
    }

    /** Satistics */
    function configStats() {
        filteredData.forEach(function (tweet) {
            metrics.current.users.add(tweet.userName);
            if (tweet.retweet) metrics.current.retweets = (metrics.current.retweets || 0) + 1
            if (tweet.reply) metrics.current.replies = (metrics.current.replies || 0) + 1
            if (tweet.position) metrics.current.geolocated = (metrics.current.geolocated || 0) + 1
            metrics.current.mediasAndLink = (metrics.current.mediasAndLink || 0) + tweet.mediasAndLink
            metrics.current.total = (metrics.current.total || 0) + 1
            metrics.current.mentions = (metrics.current.mentions || 0) + tweet.mentions
        });
        setStatistics({
            users: metrics.current.users.size,
            retweets: (metrics.current.retweets || 0),
            mediaAndLinks: metrics.current.mediasAndLink,
            total: metrics.current.total,
            mentions: metrics.current.mentions,
            geolocated: metrics.current.geolocated,
            replies: metrics.current.replies
        })
    }

    /**
     * 
     * ###########  Auxiliary Functions  ###########
     * 
    */

    /** Attach color */
    function attachColor(data) {
        data.forEach((value, idx) => value.color = colors[idx]);

    }

    function addColorToData(data) {
        const keyColor = {}
        let i = 0

        const newData = data.map(t => {
            if (keyColor[t.key]) return { ...t, color: keyColor[t.key] }
            else {
                if (i > colors.length - 1) return t
                keyColor[t.key] = colors[i]
                i += 1
                return { ...t, color: keyColor[t.key] }
            }
        }).filter(t => t.color)

        setColors(keyColor);
        return newData
    }


    /** Add markers to map */
    function addMarkers() {
        filteredData
            .forEach(function (tweet) {
                tweet.date = new Date(tweet.date);
                MapController.createMarker(tweet, _, true);
            });
    }


    /** Render */

    return (
        <div className="main-container">
            <PageHeader title="Tweets monitor" subTitle="Monitore assuntos em tempo real (ou quase isso)">
                <div className="tweets-search-container">
                    <Search
                        enterButton
                        placeholder="Filtre por temas"
                        className="tweets-search" />
                </div>
            </PageHeader>
            <Card title="Métricas" bordered={false}>
                <TweetsStatistics statistics={statistics} />
            </Card>

            <Card title="Contagem temporal" bordered={false}>
                <div className="series-container">
                    <div id="series"></div>
                </div>
            </Card>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Localização" bordered={false}>
                        <div className="map-container">
                            <div id="map"></div>
                        </div >
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Contagem total" bordered={false}>
                        <div className="bars-container">
                            <div id="bar"></div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}