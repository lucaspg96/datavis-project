import React from 'react';
import { Progress, Statistic, Row, Col } from 'antd';
import './TweetsStatistics.scss';

export default function TweetsStatistics({ statistics }) {

  const { users = 0, retweets = 0, mediaAndLinks = 0, total = 0 } = statistics

  return <div className="tweets-statistics-container">
    <Row gutter={[16, 16]}>

      <Col span={6}>
        <Statistic title="Total" value={total} />
      </Col>

      <Col span={6}>
        <Statistic title="Usuários" value={users} />
      </Col>

      <Col span={6}>
        <Statistic title="Retweets" value={retweets} />
      </Col>

      <Col span={6}>
        <Statistic title="Mídia e Links" value={mediaAndLinks} />
      </Col>


    </Row>


  </div>

}