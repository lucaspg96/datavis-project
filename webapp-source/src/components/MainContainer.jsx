import React from 'react'
import { Tabs, Drawer, Button } from 'antd';
import 'antd/dist/antd.css';
import "./MainContainer.scss";
import RealTimeContainer from './RealTimeContainer/RealTimeContainer';
import { useState } from 'react';
import { StaticMainContainer } from './Statics/StaticMainContainer';

const { TabPane } = Tabs;

export default function MainContainer() {

    const [view, setView] = useState(<StaticMainContainer key={+ new Date()} onBack={() => setVisible(true)} />)
    // const [view, setView] = useState(<RealTimeContainer key={+ new Date()} onBack={() => setVisible(true)} />)
    const [visible, setVisible] = useState(false)

    function setStaticView() {
        setVisible(false)
        setView(<StaticMainContainer key={+ new Date()} onBack={() => setVisible(true)} />)
    }

    function setRealTimeView() {
        setVisible(false)
        setView(<RealTimeContainer key={+ new Date()} onBack={() => setVisible(true)} />)
    }

    return <>
        <Drawer
            title="Selecione um painel"
            placement="left"
            visible={visible}
            onClose={() => setVisible(false)}
        >
            <Button type="link" onClick={setStaticView}>Análise histórica</Button>
            <Button type="link" onClick={setRealTimeView}>Análise em tempo real</Button>
        </Drawer>

        <div className="view-container">
            {view}
        </div>
    </>;
}