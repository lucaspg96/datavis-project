import React from 'react';
import { Input, PageHeader, Row, Col, Card, Checkbox } from 'antd';
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chart, registerShape, Util } from '@antv/g2';
import { groupBy, map, isEmpty } from 'lodash';
import DataSet from '@antv/data-set';
import * as d3 from "d3";
import _ from 'lodash';

import * as MapController from '../../map/MapController';
import './StaticMainContainer.scss';

// import data from './data.json';
import TweetsStatistics from '../RealTimeContainer/TweetsStatistics';
import TwitterService from '../../services/TwitterService';

const CheckboxGroup = Checkbox.Group

const maxWords = 50;
const blues = d3.schemeBlues[8].splice(3, 4)

export function StaticMainContainer() {

    const [data, setData] = useState();

    const [selectedKeys, setSelectedKeys] = useState([])
    const keyFilter = t => selectedKeys.length === 0 || selectedKeys.includes(t.key)

    const [selectedTypes, setSelectedTypes] = useState([])
    const typeFilter = t => selectedTypes.length === 0 || selectedTypes.includes(t.type)

    const barChart = useRef()
    const seriesChart = useRef()
    const wordChart = useRef()

    const filteredData = (data || [])
        .filter(keyFilter)
        .filter(typeFilter)

    const colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]

    const [statistics, setStatistics] = useState({});
    const metrics = useRef({ users: new Set() })
    const [coloredKeys, setColors] = useState([]);

    function getTweetType(tweet) {
        if (tweet.retweet) return "Retweet"
        else if (tweet.reply) return "Resposta"
        else return "Original"
    }

    useEffect(() => {
        /** Backend's Request to get historical tweets*/
        TwitterService.find().then(data => {
            console.log(data)
            data.forEach(d => {
                d.date = new Date(parseInt(d.date.$numberLong))
                d.type = getTweetType(d)
            });
            setData(addColorToData(data))
        })
    }, [])


    useEffect(() => {
        if (data) init();
    }, [data])

    useEffect(() => {
        MapController.clearMarkers()
        if (!isEmpty(data)) {
            drawBarChart();
            drawSeriesChart();
            drawWordChart();
            addMarkers();
        }
        // draw()
    }, [selectedKeys])

    //** Initializations */
    function init() {
        MapController.createMap("map");
        draw();
    }

    function draw() {

        if (data) {
            drawBarChart();
            drawSeriesChart();
            configStats();
            addMarkers();
            drawWordChart();
        }

    }

    /**
     * 
     * ###########  Draw Charts  ###########
     * 
    */

    function getTextAttrs(cfg) {
        return {
            ...cfg.style,
            fontSize: cfg.data.size,
            text: cfg.data.text,
            textAlign: 'center',
            fontFamily: cfg.data.font,
            fill: cfg.color,
            textBaseline: 'Alphabetic'
        };
    }

    registerShape('point', 'cloud', {
        draw(cfg, container) {
            const attrs = getTextAttrs(cfg);
            const textShape = container.addShape('text', {
                attrs: {
                    ...attrs,
                    x: cfg.x,
                    y: cfg.y
                }
            });
            if (cfg.data.rotate) {
                Util.rotate(textShape, cfg.data.rotate * Math.PI / 180);
            }
            return textShape;
        }
    });

    /** Word Cloud */
    function drawWordChart() {

        const dv = configWorldCloud();
        const [min, max] = dv.range('value');

        const colorRange = d3.scaleQuantize()
            .domain([min, max])
            .range(blues)

        if (wordChart.current) {
            wordChart.current.destroy()
        }

        const chart = new Chart({
            container: 'word-cloud',
            autoFit: true,
            height: 300,
            padding: 0
        });

        chart.data(dv.rows);
        chart.scale({
            x: { nice: false },
            y: { nice: false }
        });
        chart.legend(false);
        chart.axis(false);
        chart.tooltip({
            showTitle: false,
            showMarkers: false
        });
        chart.coordinate().reflect();
        chart.point()
            .position('x*y')
            .color('value', v => {

                return colorRange(v)
            })
            .shape('cloud');
        chart.render();

        wordChart.current = chart
    }

    function configWorldCloud() {
        const wc = getWordCount()
        const dv = new DataSet.View().source(wc);

        const [min, max] = dv.range('value');
        const mean = 10
        dv.transform({
            spiral: 'rectangular',
            type: 'tag-cloud',
            fields: ['key', 'value'],
            font: 'serif',
            size: [600, 300],
            padding: 0,
            timeInterval: Infinity,
            rotate() {
                let random = ~~(Math.random() * 4) % 4;
                if (random === 2) {
                    random = 0;
                }
                return random * 90; // 0, 90, 270
            },
            fontSize(d) {
                const [minFont, maxFont] = [24, 80]
                const size = ((d.value - min) / (max - min)) * (maxFont - minFont) + minFont
                return size;
            }
        });
        return dv;
    }

    /** Bar Chart */
    function drawBarChart() {

        const barData = getBarData();

        if (barChart.current) {
            barChart.current.changeData(barData)
            return
        }

        const chart = new Chart({
            container: 'bar',
            autoFit: true,
            height: 300,
            renderer: 'svg'
        });




        chart.data(barData);
        chart.coordinate('rect').transpose();
        chart.legend("key", {
            onClick: e => {
                console.log(e)
            }
        });
        chart.tooltip(true);
        chart.interval()
            .position('key*value')
            .color('key', key => coloredKeys[key])

        chart.on("click", handleChartClick)


        chart.render();
        barChart.current = chart
    }

    /** Series Chart */
    function drawSeriesChart() {

        const chartData = getSeriesData();

        if (seriesChart.current) {
            seriesChart.current.changeData(chartData)
            return
        }

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
            .shape("smooth")
            .color('keyword', key => coloredKeys[key])
            .label(false)

        chart.axis('date', {
            label: {
                formatter: date => {
                    return new Date(parseInt(date)).toLocaleString()
                }
            },
            animateOption: {
                update: {
                    duration: 1000,
                    easing: 'easeLinear'
                }
            }
        });

        chart.on("click", handleChartClick)

        chart.render();
        seriesChart.current = chart
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

        return _.sortBy(groupedData, tweets => tweets.value);
    }

    /** Process data to Series Chart */
    function getSeriesData() {
        const facts = crossfilter(filteredData)
        const dimension = facts.dimension(d => [d.key, d.date, d.color])
        const group = dimension.group().reduceSum(_ => 1)

        const seriesData = group.all()
            .sort((a, b) => a.key[1].getTime() < b.key[1].getTime())
            .map(d => ({ keyword: d.key[0], date: new Date(d.key[1]), color: d.key[2], value: d.value }))
        return seriesData
    }

    /** Satistics */
    function configStats() {
        metrics.current = { users: new Set() }
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

    function handleChartClick(e) {
        // console.log(e)
        // const filteredKeys = e.view.filteredData.map(d => d.key)
        // const clickedObj = e.data

        // // console.log(e)
        // // const seriesFilteredData = seriesChart.current.filteredData.filter(d => filteredKeys.includes(d.keyword))
        // // console.log(seriesChart.current)
        // // seriesChart.current.changeData(seriesFilteredData)

        // if (clickedObj) {
        //     const key = clickedObj.data.key
        //     if (selectedKeys.includes(key)) setSelectedKeys(selectedKeys.filter(k => k != key))
        //     else setSelectedKeys([...selectedKeys, key])
        // }
        // else {
        //     setSelectedKeys(filteredKeys)
        // }
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
        setSelectedKeys(Object.keys(keyColor))
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

    function getWordCount() {
        const wc = {}

        filteredData.forEach(({ wordCount }) => {
            Object.entries(wordCount).map(([word, count]) => wc[word] = count + (wc[word] || 0))
        })

        const wordCount = Object.entries(wc)
            .map(([key, value]) => ({ key, value }))

        wordCount.sort((a, b) => b.value - a.value)

        if (wordCount.length <= maxWords) return wordCount
        else return wordCount.slice(0, maxWords)
    }


    /** Render */

    return (
        <div className="main-container">
            <PageHeader title="Tweets Analyzer" subTitle="Análise histórica dos tweets consumidos">
                <CheckboxGroup options={Object.keys(coloredKeys)} value={selectedKeys} onChange={setSelectedKeys} />
            </PageHeader>
            <Card title="Métricas" bordered={false}>
                <TweetsStatistics statistics={statistics} />
            </Card>

            <br />
            <Row>
                <Card title="Contagem temporal" bordered={false}>
                    <div className="static-series-container">
                        <div id="series"></div>
                    </div>
                </Card>
            </Row>
            <br />
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Palavras mais utilizadas" bordered={false}>
                        <div className="word-cloud-container">
                            <div id="word-cloud"></div>
                        </div>
                    </Card>

                </Col>
                <Col span={12}>
                    <Card title="Contagem total" bordered={false}>
                        <div className="static-bars-container">
                            <div id="bar"></div>
                        </div>
                    </Card>
                </Col>
            </Row>
            <br />

            <Row>
                <Card title="Localização" bordered={false}>
                    <div className="map-container">
                        <div id="map"></div>
                    </div >
                </Card>
            </Row>
        </div>
    );
}