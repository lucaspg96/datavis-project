import React from 'react';
import { Input, PageHeader, Row, Col, Card } from 'antd';
import { useRef } from 'react';
import crossfilter from 'crossfilter';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chart } from '@antv/g2';
import {groupBy} from 'lodash';
import _ from 'lodash';

import * as MapController from '../../map/MapController';
import './StaticMainContainer.scss';

import data from './data.json';
import TweetsStatistics from '../SeriesContainer/TweetsStatistics';

const { Search } = Input;

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


    useEffect(() => {
        MapController.createMap("map");
        drawBarChart();
        configStats();
        addMarkers();
    }, [])


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


    /** @TODO implementar cores */
    function getBarData(){

        const groupedData = _(data)
                            .groupBy(tweet => tweet.key)
                            .map(tweet => _.merge({
                                key: tweet[0].key, 
                                value: tweet.length,
                                color: colors[0]
                            })).value();

        return _.sortBy(groupedData, tweets => tweets.value);
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

    /** Add markers to map */
    function addMarkers(){
        data.filter(tweet => tweet.position)
            .forEach(function(tweet) { 
                tweet.date = new Date(tweet.date);
                MapController.createMarker(tweet);
        });
    }


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