import React from 'react';
import {Alert} from 'react-bootstrap';


class AlertDismissible extends React.Component {
  constructor(props) {
    super(props);
    this.children = props.children;
    this.variant = props.variant || 'danger';
    this.state = {
      show: props.parentValue ? props.parentValue() : true
    };
  }

  setShow(value) {
    if (this.props.parentValue) {
      this.props.parentValue(value);
    }
    return this.setState({show: this.props.parentValue ? this.props.parentValue() : value});
  }

  render() {
    return this.state.show ? (<Alert variant={this.variant} onClose={() => this.setShow(false)} dismissible>
      {this.children}
    </Alert>) : '';
  }
}

export default AlertDismissible;
