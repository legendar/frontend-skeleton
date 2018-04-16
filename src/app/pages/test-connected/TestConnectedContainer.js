import { autobind } from 'core-decorators'
import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import TestConnectedView from './TestConnectedView'

class TestContainer extends Component {
  componentWillMount() {
  }

  @autobind
  onSubmit(data) {
    console.log('submitted', data)
  }

  render() {
    const { handleSubmit, ...props } = this.props
    return (
      <TestConnectedView
        {...props}
        onSubmit={handleSubmit(this.onSubmit)}
      />
    )
  }
}


export default compose(
  reduxForm({
    form: 'test-connected',
    initialValues: {
      customers: [
        { firstName: '', lastName: '1' },
        { firstName: '', lastName: '2' },
      ]
    }
  }),
)(TestContainer)
