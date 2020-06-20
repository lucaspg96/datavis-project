import React from 'react';
import './SeriesContainer.scss'
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Input, Spin, Tag, PageHeader, Row, Col } from 'antd';
import { Chart } from '@antv/g2';
import { isEmpty, sum } from 'rambda';
import * as SocketController from '../../socket/SocketController';
import * as MapController from '../../map/MapController';

const { Search } = Input;

const graphRedrawRate = 1500
const timeWindowSize = 1 * 60 * 1000

export default function SeriesContainer() {

    const [seriesChart, setSeriesChart] = useState();
    const [seriesChartRedrawTimeout, setSeriesChartRedrawTimeout] = useState()

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
        count.current[keyword] = 0;
        const color = colors.filter(c => !takenColors.map(c => c[1]).includes(c))[0]
        setTakenColors([...takenColors, [keyword, color]])
        SocketController.addSocket({ keyword, color })
    }

    useEffect(() => {
        // series chart listener to collect all tweets

        SocketController.addListenner("time", ({ color, key, date }) => {
            count.current[key] += 1;
            data.current.push({ color, key, date });
        });

        SocketController.addListenner("map", tweet => {
            MapController.createMarker(tweet);
        });
    }, [])

    useEffect(() => {
        data.current.splice(0, data.current.length)
        Object.keys(count.current).forEach(k => count.current[k] = 0)
        if (seriesChart && !isEmpty(takenColors)) {
            seriesChart.destroy()
            setSeriesChart();
        }
        if (!isEmpty(takenColors)) {
            try {
                MapController.createMap("map");
            } catch (error) {
                console.log("Map error:", error)
            }
            drawSeriesChart();
            if (!barChart) drawBarChart();
            else refreshBarChartColors();
        }
        else {
            if (barChart) {
                barChart.destroy()
                setBarChart();
            }
            if (seriesChartRedrawTimeout) clearTimeout(seriesChartRedrawTimeout)
            if (barChartRedrawTimeout) clearTimeout(barChartRedrawTimeout)
        }
    }, [takenColors])

    function redrawSeriesChart(chart) {
        const data = getSeriesData()
        chart.changeData(data)
        setSeriesChartRedrawTimeout(setTimeout(_ => redrawSeriesChart(chart), graphRedrawRate))
    }

    function refreshBarChartColors() {
        try {
            barChart.interval()
                .position('key*value')
                .color('key', k => {
                    return (takenColors.filter(c => c[0] === k)[0] || [1, "rgba(0,0,0,0)"])[1];
                })
        } catch (error) {
            console.log("Bar colors error:", error)
        }

    }

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
            return setTimeout(drawSeriesChart, graphRedrawRate)

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

        setSeriesChartRedrawTimeout(setTimeout(_ => redrawSeriesChart(chart), graphRedrawRate));

    }

    function getBarData() {
        return Object.entries(count.current)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => a.value < b.value)
    }

    function redrawBarChart(chart) {
        const data = getBarData()
        chart.annotation().clear(true);
        chart.annotation().text({
            position: ['95%', '10%'],
            content: sum(data.map(d => d.value)) + " tweets",
            style: {
                fontSize: 40,
                fontWeight: 'bold',
                fill: '#ddd',
                textAlign: 'end'
            },
            animate: false,
        });

        chart.changeData(data)
        setBarChartRedrawTimeout(setTimeout(_ => redrawBarChart(chart), graphRedrawRate));
    }

    function drawBarChart() {

        const data = getBarData()

        if (isEmpty(data))
            return setTimeout(drawBarChart, graphRedrawRate)

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
                fill: '#ddd',
                textAlign: 'end'
            },
            animate: false,
        });

        chart
            .interval()
            .position('key*value')
            .color('key', k => {
                return (takenColors.filter(c => c[0] === k)[0] || [1, "rgba(0,0,0,0)"])[1];
            })
            // .label('value', (value) => {
            //     return {
            //         animate: {
            //             appear: {
            //                 animation: 'label-appear',
            //                 delay: 0,
            //                 duration: 500,
            //                 easing: 'easeLinear'
            //             },
            //             update: {
            //                 animation: 'label-update',
            //                 duration: 500,
            //                 easing: 'easeLinear'
            //             }
            //         },
            //         offset: 5,
            //     };
            // })
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

        setBarChartRedrawTimeout(setTimeout(_ => redrawBarChart(chart), graphRedrawRate));
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

        {!isEmpty(takenColors) && <>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <div className="map-container">
                        <div id="map"></div>
                    </div >
                </Col>

                <Col span={12}>
                    <div className="bars-container">
                        <div id="bar"></div>
                    </div>
                </Col>
            </Row>

            <div className="series-container">
                <div id="series"></div>
            </div>
        </>}


    </div >
        ;

}