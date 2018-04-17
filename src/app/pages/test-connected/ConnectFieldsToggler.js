import {autobind } from 'core-decorators'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Fields, change as changeField } from 'redux-form'
import get from 'lodash/get'
import findIndex from 'lodash/findIndex'
import without from 'lodash/without'
import PropTypes from 'prop-types'

export default function ConnectFieldsTogglerHOC({names}) {
  return <Fields names={names} component={ConnectFieldsToggler}/>
}

@connect(null, {changeField})
@withFormNameHOC
class ConnectFieldsToggler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      values: getValues(props, props.names)
    }
  }

  componentWillUpdate(props) {
    if(this.state.connected && props !== this.props) {
      const lastValues = this.state.values
      const newValues = getValues(props, props.names)
      const changedFieldIndex = findIndex(
        lastValues,
        (value, index) => value !== newValues[index],
      )
      if(changedFieldIndex !== -1) {
        this.setState(
          {values: newValues},
          () => this.invokeChanges(changedFieldIndex),
        )
      }
    }
  }

  invokeChanges(index) {
    const value = this.state.values[index]
    const changedName = this.props.names[index]
    without(this.props.names, changedName).forEach(
      name => this.props.changeField(this.props.formName, name, value)
    )
  }

  @autobind
  toggle() {
    const connected = !this.state.connected
    this.setState(
      { connected, values: getValues(this.props, this.props.names) },
      () => {
        // copy from first field on initialize connect
        if(connected) {
          this.invokeChanges(0)
        }
      }
    )
  }

  render() {
    return (
      <div>
        <button onClick={this.toggle}>toggle connected</button>
        <span>is connected: {this.state.connected ? 'yes' : 'no'}</span>
      </div>
    )
  }
}

function getValues(state, names) {
  return names.map(name => get(state, `${name}.input.value`))
}


function withFormNameHOC(ComposedComponent) {
  class WithFormNameContainer extends Component {
    render() {
      return (
        <ComposedComponent {...this.props} formName={this.context._reduxForm.form} />
      )
    }
  }

  WithFormNameContainer.contextTypes = {
    _reduxForm: PropTypes.object.isRequired,
  }

  return WithFormNameContainer
}
