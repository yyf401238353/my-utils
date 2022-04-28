import React, { useCallback } from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDemoData, setCount, resetDemo, demoSelector } from '@/store/demo'

// Selectors can compute derived data and memoizing,
// allowing Redux to store the minimal possible state.
// https://react-redux.js.org/next/api/hooks#using-memoizing-selectors
const selector = createSelector(demoSelector, (demo) => ({
  ...demo,
  data: demo.data.filter((item) => item.id % 2 === 1)
}))

const ReduxHookDemo = () => {
  const dispatch = useDispatch()
  const { data, count, loading } = useSelector(selector)
  const sendRequest = useCallback(() => {
    dispatch(
      fetchDemoData({
        text: '1234'
      })
    )
  }, [])

  return (
    <div>
      <button type="primary" onClick={sendRequest}>
        Request
      </button>
      <button
        type="primary"
        onClick={() => {
          dispatch(resetDemo())
        }}
      >
        Clear
      </button>
      {loading ? <p>Loading...</p> : <p>Your data:</p>}
      {data.map((m, n) => {
        return <h4 key={n}>{m.title}</h4>
      })}
      <br />
      <br />
      <p>You clicked {count} times</p>
      <button
        type="primary"
        onClick={() => {
          dispatch(setCount(count + 1))
        }}
      >
        Click
      </button>
    </div>
  )
}

export default ReduxHookDemo
