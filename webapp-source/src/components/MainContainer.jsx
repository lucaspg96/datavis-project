import React from 'react'
import { MapContainer } from './MapContainer/MapContainer';
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import "./MapContainer.scss";
import CountContainer from './CountContainer/CountContainer';

const { TabPane } = Tabs;

export default function MainContainer() {
    return <Tabs defaultActiveKey="1"
        type="card"
    >
        <TabPane tab="Mapa" key="1">
            <MapContainer />
        </TabPane>
        <TabPane tab="Contagem" key="2">
            <CountContainer />
        </TabPane>
    </Tabs>;
}