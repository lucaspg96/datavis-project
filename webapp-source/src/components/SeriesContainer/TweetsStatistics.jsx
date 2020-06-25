import React from 'react';
import { Statistic, Row, Col, Tooltip } from 'antd';
import './TweetsStatistics.scss';

const columnSpan = 3

export default function TweetsStatistics({ statistics }) {

  const { users = 0,
    retweets = 0,
    mediaAndLinks = 0,
    total = 0,
    mentions = 0,
    replies = 0,
    geolocated = 0 } = statistics

  return <div className="tweets-statistics-container">
    <Row gutter={[8, 16]}>

      <Tooltip title="Total de tweets" trigger="hover" onVisibleChange={console.log}>
        <Col span={columnSpan}>
          <Statistic title="Total" value={total} />
        </Col>
      </Tooltip>

      <Tooltip title="Total de tweets com localização">
        <Col span={columnSpan}>
          <Statistic title="Geolocalizados" value={geolocated} />
        </Col>
      </Tooltip>

      <Tooltip title="Número de usuários distintos twittando">
        <Col span={columnSpan}>
          <Statistic title="Usuários" value={users} />
        </Col>
      </Tooltip>

      <Tooltip title="Quantidade de mídia e links compartilhadas">
        <Col span={columnSpan}>
          <Statistic title="Mídia e Links" value={mediaAndLinks} />
        </Col>
      </Tooltip >

      <Tooltip title="Quantidade de menções realizadas">
        <Col span={columnSpan}>
          <Statistic title="Menções" value={mentions} />
        </Col>
      </Tooltip >

      <Tooltip title="Total de retweets">
        <Col span={columnSpan}>
          <Statistic title="Retweets" value={retweets} />
        </Col>
      </Tooltip >

      <Tooltip title="Total de respostas">
        <Col span={columnSpan}>
          <Statistic title="Respostas" value={replies} />
        </Col>
      </Tooltip >

      <Tooltip title="Total de tweets que não são retweets ou respostas">
        <Col span={columnSpan}>
          <Statistic title="Originais" value={total - retweets - replies} />
        </Col>
      </Tooltip >


    </Row >


  </div >

}