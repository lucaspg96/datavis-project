import React from 'react';
import { Input, PageHeader, Row, Col, Card } from 'antd';
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chart } from '@antv/g2';
import {groupBy, map} from 'lodash';
import _ from 'lodash';

import * as MapController from '../../map/MapController';
import './StaticMainContainer.scss';

import data from './data.json';
import TweetsStatistics from '../RealTimeContainer/TweetsStatistics';
import TwitterService from '../../services/TwitterService';

const { Search } = Input;
const timeWindowSize = 0.5 * 60 * 1000

export function StaticMainContainer() {

    const colors = [
        "#1F77B4",
        "#FF7F0E",
        "#2CA02C",
        "#9467BD",
        "#E377C2",
    ];

    const [statistics, setStatistics] = useState({});
    const metrics = useRef({ users: new Set() })
    const [coloredKeys, setColors] = useState([]);


    useEffect(() => {
        init();
    }, [])

    //** Initializations */
    function init(){
        colorByKey();
        MapController.createMap("map");
        drawBarChart();
        drawSeriesChart();
        configStats();
        addMarkers();
        console.log(coloredKeys);
    }

    /** Backend's Request to get historical tweets*/
    function getStaticData(){
        return TwitterService.find();
    }

    /**
     * 
     * ###########  Draw Charts  ###########
     * 
    */

    /** Bar Chart */
    function drawBarChart(){

        const barChart = new Chart({
            container: 'bar',
            autoFit: true,
            height: 300,
            renderer: 'svg'
        });
        
        const barData = getBarData();

        barChart.data(barData);
        barChart.coordinate('rect').transpose();
        barChart.legend(false);
        barChart.tooltip(true);
        barChart.interval()
                .position('key*value')
                .color('color', color => color)

        barChart.render();
    }

    /** Series Chart */
    function drawSeriesChart(){

        const chartData = getSeriesData();
        const chart = new Chart({
            container: 'series',
            autoFit: true,
            height: 200,
            renderer: 'svg'
        })

        chart.data(chartData)

        console.log(chartData);

        chart
            .line()
            .position('date*value')
            .color('color', color => '#E377C2')
            .label(false)

        chart.axis('date', {
            animateOption: {
                update: {
                    duration: 1000,
                    easing: 'easeLinear'
                }
            }
        });

        chart.render();
    }

    /**
     * 
     * ###########  Processing Data  ###########
     * 
    */
   

    /** Process data to Bar Chart */
    function getBarData(){
        const groupedData = _(data)
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
    function getSeriesData(){
        const now = new Date();
        const cleanData = data.filter(d => new Date(d.date) < now)
        const facts = crossfilter(cleanData)
        //const dimension = facts.dimension(d => [d.key, d.date, d.color])
        const dimension = facts.dimension(d => [d.key, new Date(d.date)])
        const group = dimension.group().reduceSum(_ => 1)

        debugger;

        const seriesData = group.all()
            .sort((a, b) => a.key[1] < b.key[1])
            .map(d => ({ keyword: d.key[0], date: d.key[1].toLocaleDateString(), color: d.key[2], value: d.value }))
        return seriesData
    }

    /** Satistics */
    function configStats(){
        data.forEach(function(tweet) {
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
    function attachColor(data){
        data.forEach((value, idx) => value.color = colors[idx]);

    }

    function colorByKey(){
        const cKeys = _(data)
                            .groupBy(tweet => tweet.key)
                            .map(tweet => _.merge({
                                key: tweet[0].key
                            }))
                            .value();
        attachColor(cKeys);
        setColors(cKeys);
    }


    /** Add markers to map */
    function addMarkers(){
        data.filter(tweet => tweet.position)
            .forEach(function(tweet) { 
                tweet.date = new Date(tweet.date);
                MapController.createMarker(tweet, _,true);
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