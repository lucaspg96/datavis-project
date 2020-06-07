import React, { useRef, useState, useEffect } from 'react';
import { mean, std } from "mathjs";
import ReactWordcloud from 'react-wordcloud';
import './CountContainer.scss';
import CountDown from 'ant-design-pro/lib/CountDown';
import websocketURL from '../../websocket'
import { Input, InputNumber, Spin, Checkbox, message } from 'antd';

const { Search } = Input;

const options = {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    enableTooltip: true,
    deterministic: true,
    fontFamily: 'impact',
    fontSizes: [5, 60],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
};

export default function CountContainer() {
    const wordsFrequencies = useRef({});
    const [wordCloud, setWordCloud] = useState([])
    const [ws, setWs] = useState();
    const [search, setSearch] = useState();
    const [drop, setDrop] = useState(0);
    const [size, setSize] = useState(50);
    const [normalizeCount, setNormalizeCount] = useState(false);
    const [spin, setSpin] = useState(false);
    const [targetTime, setTargetTime] = useState(new Date().getTime() + 5000);

    useEffect(() => {
        startWebsocket();
    }, [search])

    useEffect(() => {
        updateWordCloud();
    }, [drop, size, normalizeCount])

    function startWebsocket() {
        if (ws) ws.close(3000);
        setWordCloud([]);
        setSpin(true);
        wordsFrequencies.current = {};

        const newWs = search ?
            new WebSocket(websocketURL + '/tweets?search=' + encodeURIComponent(search)) :
            new WebSocket(websocketURL + '/tweets')
        newWs.onmessage = (message) => {
            const frequencies = JSON.parse(message.data);
            Object.entries(frequencies.words).forEach(([word, frequency]) => {
                wordsFrequencies.current[word] = (wordsFrequencies.current[word] || 0) + frequency;
            });
        };

        newWs.onclose = () => {
            console.log("closing websocket")
        }

        setWs(newWs);
        setTargetTime(new Date().getTime() + 5000);

        setTimeout(() => {
            if (Object.keys(wordsFrequencies.current).length === 0) {
                message.warning("Nenhum twitter encontrado até o momento")
            }
            setSpin(false);
        }, 5000)
    }

    function normalize(wordCloud) {
        if (wordCloud.length === 0 || !normalizeCount)
            return wordCloud;

        const values = wordCloud.map(({ value }) => value)
        const m = mean(values)
        const s = std(values)

        return wordCloud.map(word => {
            return {
                ...word,
                value: (word.value + m) / s
            };
        });
    }

    function updateWordCloud() {
        if (wordsFrequencies.current.length === 0) return;
        const newWordCloud = Object
            .entries(wordsFrequencies.current)
            .map(([word, frequency]) => {
                return {
                    text: word,
                    value: frequency
                };
            })
            .sort((a, b) => b.value - a.value)
            // .filter(({ value }) => value > 1)
            .splice(0, size);

        for (let i = 0; i < drop; i++) newWordCloud.shift();

        const normalizedCloud = normalize(newWordCloud);
        setWordCloud(normalizedCloud);
        setTargetTime(new Date().getTime() + 5000)
    }

    return <div className="word-cloud-container">
        <Spin spinning={spin}>
            <div className="word-cloud-fields">
                <div className="word-cloud-field">
                    <Search
                        placeholder="Filtrar tweets"
                        enterButton="Filtrar!"
                        size="small"
                        onSearch={setSearch}
                    />
                </div>
                <div className="word-cloud-field">
                    <span>Número de palavras: </span><InputNumber defaultValue={size} onChange={setSize} />
                </div>
                <div className="word-cloud-field">
                    <span>Pular palavras: </span><InputNumber defaultValue={drop} onChange={setDrop} />
                </div>
                <div className="word-cloud-field">
                    <Checkbox onChange={setNormalizeCount}> Normalizar Frequências </Checkbox>
                </div>
            </div>
        </Spin>
        <CountDown
            className="count-down-refresh"
            target={targetTime}
            onEnd={updateWordCloud}
        />
        {wordCloud.length !== 0 && <ReactWordcloud words={wordCloud} options={options} />}
    </div>;
}