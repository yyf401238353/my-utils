import React from 'react'
import { connect } from 'react-redux'
import { fetchDemoData, setCount, resetDemo } from '@/store/demo'

class ClassEffectDemo extends React.Component {
  fetchData = () => {
    this.props.dispatch(
      fetchDemoData({
        text: '1234'
      })
    )
  }

  get data() {
    const { data } = this.props.demo
    return data.filter((item) => item.id % 2 === 1)
  }

  render() {
    const { data } = this
    const { count, loading } = this.props.demo

    return (
      <div>
        <button type="primary" onClick={this.fetchData}>
          Request
        </button>
        <button
          type="primary"
          onClick={() => {
            this.props.dispatch(resetDemo())
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
            this.props.dispatch(setCount(count + 1))
          }}
        >
          Click
        </button>
      </div>
    )
  }
}

export default connect((state) => ({
  demo: state.demo
}))(ClassEffectDemo)
