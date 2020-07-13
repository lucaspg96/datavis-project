import React from 'react';
import { Statistic, Row, Col, Tooltip, Divider } from 'antd';
import './TweetsStatistics.scss';

const columnSpan = 3

export default function TweetsStatistics({ statistics,
  selectable = false,
  onClick = () => false,
  selected = []
}) {

  const { users = 0,
    retweets = 0,
    mediaAndLinks = 0,
    total = 0,
    mentions = 0,
    replies = 0,
    geolocated = 0,
    originals = 0
  } = statistics

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
        <Col span={columnSpan} >
          <div onClick={_ => onClick("retweet")}>
            <Statistic className={`retweets ${selectable ? "selectable" : ""} ${selected.includes("retweet") ? "selected" : ""}`} title="Retweets" value={retweets} />
          </div>
        </Col>
      </Tooltip >

      <Tooltip title="Total de respostas">
        <Col span={columnSpan}>
          <div onClick={_ => onClick("reply")}>
            <Statistic className={`${selectable ? "selectable" : ""} ${selected.includes("reply") ? "selected" : ""}`} title="Respostas" value={replies} />
          </div>
        </Col>
      </Tooltip >

      <Tooltip title="Total de tweets que não são retweets ou respostas">
        <Col span={columnSpan}>
          <div onClick={_ => onClick("original")}>
            <Statistic className={`${selectable ? "selectable" : ""} ${selected.includes("original") ? "selected" : ""}`} title="Originais" value={originals} />
          </div>
        </Col>
      </Tooltip >


    </Row >


  </div >

}