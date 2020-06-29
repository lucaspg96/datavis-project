import React from 'react'
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import "./MapContainer.scss";
import RealTimeContainer from './RealTimeContainer/RealTimeContainer';

const { TabPane } = Tabs;

export default function MainContainer() {
    return <RealTimeContainer />;
}