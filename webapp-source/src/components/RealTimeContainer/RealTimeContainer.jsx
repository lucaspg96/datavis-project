import React from 'react';
import './RealTimeContainer.scss'
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Input, Spin, Tag, PageHeader, Row, Col, Card } from 'antd';
import { Chart } from '@antv/g2';
import { isEmpty, sum } from 'rambda';
import * as SocketController from '../../services/SocketController';
import * as MapController from '../../map/MapController';
import CountDown from 'ant-design-pro/lib/CountDown';
import TweetsStatistics from './TweetsStatistics';
import TrendsContainer from './TrendsContainer';

const { Search } = Input;

const graphRefreshTimeout = 1500
const timeWindowSize = 0.5 * 60 * 1000

export default function RealTimeContainer({ onBack }) {

    const [statistics, setStatistics] = useState({});
    const [targetTime, setTargetTime] = useState();

    const [seriesChart, setSeriesChart] = useState();

    const metrics = useRef({ users: new Set() })

    const [barChart, setBarChart] = useState();

    const [search, setSearch] = useState("");

    const colors = [
        "#1F77B4",
        "#278944"
        // "#FF7F0E",
        // "#2CA02C",
        // "#9467BD",
        // "#E377C2",
    ];

    const [takenColors, setTakenColors] = useState([]);
    const keyColor = useRef([]);

    const data = useRef([])
    const count = useRef({})

    function addSocket(keyword = "") {
        setSearch("")
        console.log("socket:", keyword)
        const color = colors.filter(c => !takenColors.map(c => c[1]).includes(c))[0]
        count.current[keyword] = { value: 0, color };
        setTakenColors([...takenColors, [keyword, color]])
        SocketController.addSocket({ keyword, color })
        setTargetTime(new Date().getTime() + graphRefreshTimeout)
    }

    function updateAll() {
        drawSeriesChart()
        drawBarChart()
        setStatistics({
            users: metrics.current.users.size,
            retweets: (metrics.current.retweets || 0),
            mediaAndLinks: metrics.current.mediasAndLink,
            total: metrics.current.total,
            mentions: metrics.current.mentions,
            geolocated: metrics.current.geolocated,
            replies: metrics.current.replies,
            originals: metrics.current.original
        })

        setTargetTime(new Date().getTime() + graphRefreshTimeout)
    }

    useEffect(() => {
        // series chart listener to collect all tweets

        SocketController.addListenner("time", ({ color, key, date }) => {
            count.current[key].value += 1;
            data.current.push({ color, key, date });
        });

        SocketController.addListenner("map", tweet => {
            MapController.addMarker(tweet);
        });

        SocketController.addListenner("metrics", ({ userName, retweet, reply, mediasAndLink, mentions, position }) => {
            metrics.current.users.add(userName)
            if (retweet) metrics.current.retweets = (metrics.current.retweets || 0) + 1
            else if (reply) metrics.current.replies = (metrics.current.replies || 0) + 1
            else metrics.current.original = (metrics.current.original || 0) + 1
            if (position) metrics.current.geolocated = (metrics.current.geolocated || 0) + 1
            metrics.current.mediasAndLink = (metrics.current.mediasAndLink || 0) + mediasAndLink
            metrics.current.total = (metrics.current.total || 0) + 1
            metrics.current.mentions = (metrics.current.mentions || 0) + mentions

        })

        MapController.createMap("map");
        drawSeriesChart();
        drawBarChart();
    }, [])

    useEffect(() => {
        Object.keys(metrics.current).forEach(k => metrics.current[k] = 0)
        metrics.current.users = new Set();
        data.current.splice(0, data.current.length)
        Object.keys(count.current).forEach(k => count.current[k].key = 0)
        MapController.clearMarkers();
        keyColor.current = takenColors
    }, [takenColors])

    function getSeriesData() {
        if (isEmpty(data.current)) {
            return []
        }

        const now = data.current[data.current.length - 1].date.getTime() - 1000
        const cleanData = data.current.filter(d => d.date.getTime() < now &&
            now - d.date.getTime() < timeWindowSize)
        const facts = crossfilter(cleanData)
        const dimension = facts.dimension(d => [d.key, d.date, d.color])
        const group = dimension.group().reduceSum(_ => 1)

        const seriesData = group.all()
            .sort((a, b) => a.key[1] < b.key[1])
            .map(d => ({ keyword: d.key[0], date: d.key[1].toLocaleTimeString(), color: d.key[2], value: d.value }))

        // console.log(seriesData)

        return seriesData
    }

    function handleRemove(tag) {
        SocketController.removeSocket(tag)
        delete count.current[tag]
        // if (takenColors.length === 1) seriesChart.destroy();
        setTakenColors(takenColors.filter(c => c[0] !== tag))
    }

    function drawSeriesChart() {
        const chartData = getSeriesData()
        if (isEmpty(chartData))
            return;

        if (seriesChart) {
            seriesChart.changeData(chartData)
            return;
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
            .color('keyword', k => {
                return keyColor.current.filter(c => c[0] === k)[0][1]
            })
            .label(false)

        chart.tooltip({
            showCrosshairs: true,
            shared: true,
        });

        chart.axis('date', {
            animateOption: {
                update: {
                    duration: 1000,
                    easing: 'easeLinear'
                }
            }
        });

        chart.render()
        setSeriesChart(chart)
    }

    function getBarData() {
        return Object.entries(count.current)
            .map(([key, value]) => ({ ...value, key }))
            .sort((a, b) => a.value < b.value)
    }

    function drawBarChart() {

        const data = getBarData()

        if (isEmpty(data))
            return;

        if (barChart) {
            barChart.annotation().clear(true);
            // barChart.annotation().text({
            //     position: ['95%', '10%'],
            //     content: sum(data.map(d => d.value)) + " tweets",
            //     style: {
            //         fontSize: 40,
            //         fontWeight: 'bold',
            //         fill: '#dadada',
            //         textAlign: 'end'
            //     },
            //     animate: false,
            // });

            barChart.changeData(data)
            return;
        }

        const chart = new Chart({
            container: 'bar',
            autoFit: true,
            height: 300,
            renderer: 'svg'
            // padding: [20, 60]
        });
        // @ts-ignore
        chart.data(data);
        chart.coordinate('rect').transpose();
        chart.legend(false);
        chart.tooltip(true);
        // chart.axis('value', false);
        // chart.axis('key', {
        //     animateOption: {
        //         update: {
        //             duration: 1000,
        //             easing: 'easeLinear'
        //         }
        //     }
        // });

        // chart.annotation().text({
        //     position: ['95%', '10%'],
        //     content: sum(data.map(d => d.value)) + " tweets",
        //     style: {
        //         fontSize: 40,
        //         fontWeight: 'bold',
        //         fill: '#dadada',
        //         textAlign: 'end'
        //     },
        //     animate: false,
        // });

        chart
            .interval()
            .position('key*value')
            .color('key', k => {
                return keyColor.current.filter(c => c[0] === k)[0][1]
            })
            .animate({
                appear: {
                    duration: 1000,
                    easing: 'easeLinear'
                },
                update: {
                    duration: 500,
                    easing: 'easeLinear'
                }
            });

        chart.render();
        setBarChart(chart)
    }

    function handleBack() {
        Object.keys(count.current).map(handleRemove)

        onBack()
    }

    return <div className="main-container">
        <PageHeader title="Tweets monitor" subTitle="Monitore assuntos em tempo real (ou quase isso)" onBack={handleBack}>

            <div className="trends-container">
                <TrendsContainer onClick={addSocket} disabled={takenColors.length == 2} />
            </div>

            <div className="tweets-search-container">
                <Search
                    enterButton
                    disabled={takenColors.length == 2}
                    placeholder="Ou entre seu"
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
                            <p>{tag}</p>
                        </Tag>
                    )
                    }
                </div>
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

        <CountDown
            className="count-down-refresh"
            target={targetTime}
            onEnd={updateAll}
        />

    </div >
        ;

}