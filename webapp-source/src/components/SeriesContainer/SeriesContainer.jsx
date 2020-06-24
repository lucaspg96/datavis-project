import React from 'react';
import './SeriesContainer.scss'
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Input, Spin, Tag, PageHeader, Row, Col, Card } from 'antd';
import { Chart } from '@antv/g2';
import { isEmpty, sum } from 'rambda';
import * as SocketController from '../../socket/SocketController';
import * as MapController from '../../map/MapController';
import CountDown from 'ant-design-pro/lib/CountDown';

const { Search } = Input;

const graphRefreshTimeout = 1500
const timeWindowSize = 1 * 60 * 1000

export default function SeriesContainer() {

    const [statistics, setStatistics] = useState({});
    const [targetTime, setTargetTime] = useState();

    const [seriesChart, setSeriesChart] = useState();
    const [seriesChartRedrawTimeout, setSeriesChartRedrawTimeout] = useState()

    const metrics = useRef({ users: new Set() })

    const [barChart, setBarChart] = useState();
    const [barChartRedrawTimeout, setBarChartRedrawTimeout] = useState()

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
    const count = useRef({})

    function addSocket(keyword = "") {
        setSearch("")
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
            retweets: metrics.current.retweets,
            mediaAndLinks: metrics.current.mediasAndLink
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
            MapController.createMarker(tweet);
        });

        SocketController.addListenner("metrics", ({ userName, retweet, reply, mediasAndLink }) => {
            if (!metrics.current.users) metrics.current.users = new Set();

            metrics.current.users.add(userName)
            if (retweet) metrics.current.retweets = (metrics.current.retweets || 0) + 1
            if (reply) metrics.current.replies = (metrics.current.replies || 0) + 1
            metrics.current.mediasAndLink = (metrics.current.mediasAndLink || 0) + mediasAndLink

        })

        MapController.createMap("map");
        drawSeriesChart();
        drawBarChart();
    }, [])

    useEffect(() => {
        Object.keys(metrics.current).forEach(k => metrics.current[k] = 0)
        Object.keys(count.current).forEach(k => count.current[k].key = 0)
    }, [takenColors])

    function getSeriesData() {
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
                return (takenColors.filter(c => c[0] === k)[0] || [1, "rgba(0,0,0,0)"])[1];
            })
            .label(false)

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
            barChart.annotation().text({
                position: ['95%', '10%'],
                content: sum(data.map(d => d.value)) + " tweets",
                style: {
                    fontSize: 40,
                    fontWeight: 'bold',
                    fill: '#dadada',
                    textAlign: 'end'
                },
                animate: false,
            });

            barChart.changeData(data)
            return;
        }

        const chart = new Chart({
            container: 'bar',
            autoFit: true,
            height: 300,
            // padding: [20, 60]
        });
        // @ts-ignore
        chart.data(data);
        chart.coordinate('rect').transpose();
        chart.legend(false);
        chart.tooltip(true);
        // chart.axis('value', false);
        chart.axis('key', {
            animateOption: {
                update: {
                    duration: 1000,
                    easing: 'easeLinear'
                }
            }
        });

        chart.annotation().text({
            position: ['95%', '10%'],
            content: sum(data.map(d => d.value)) + " tweets",
            style: {
                fontSize: 40,
                fontWeight: 'bold',
                fill: '#dadada',
                textAlign: 'end'
            },
            animate: false,
        });

        chart
            .interval()
            .position('key*value')
            .color('color', c => c)
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

    return <div className="main-container">
        <PageHeader title="Tweets monitor" subTitle="Monitore assuntos em tempo real (ou quase isso)">
            <div className="tweets-search-container">

                <Search
                    enterButton
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

        <Row>
            <Card title="Contagem temporal" bordered={false}>
                <div className="series-container">
                    <div id="series"></div>
                </div>
            </Card>
        </Row>



        <CountDown
            className="count-down-refresh"
            target={targetTime}
            onEnd={updateAll}
        />
    </div >
        ;

}