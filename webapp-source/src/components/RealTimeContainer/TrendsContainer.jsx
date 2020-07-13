import React from 'react'
import './TrendsContainer.scss'
import axios from "axios"
import { useState } from 'react'
import { apiURL } from '../../services'
import { useEffect } from 'react'
import { Tag } from 'antd'

export default function TrendsContainer({ onClick, disabled }) {

  const [trends, setTrends] = useState([])

  function reloadTrends() {
    axios.get(apiURL + "/trends", {
      // headers: {
      //   crossdomain: true,
      //   Host: "x"
      // }
    })
      .then(res => setTrends(res.data))
  }

  useEffect(() => {
    reloadTrends()
  }, [])

  return <>
    {!disabled && <>
      <h3>Selecione um tema:</h3>

      <div className="trends">
        {Object.entries(trends).map(([trend, value]) => <Tag onClick={_ => onClick(trend)} key={trend}>{`${trend} (${value})`}</Tag>)}
      </div>
    </>
    }

  </>

}