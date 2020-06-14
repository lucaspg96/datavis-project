import React from 'react'
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import "./MapContainer.scss";
import SeriesContainer from './SeriesContainer/SeriesContainer';

const { TabPane } = Tabs;

export default function MainContainer() {
    return <SeriesContainer />;
}