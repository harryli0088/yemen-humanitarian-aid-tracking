import React, { Component } from 'react';

import "./depot.css";

class Depot extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <g className="depot" transform={this.props.transform}>
        <rect x="-15" y="-15" width="130" height="30"></rect>
        <circle r="10" stroke="white" strokeWidth="2" fill="green" cx={0} cy={0}></circle>

        <text x="20" y="5" fontWeight="bold">RFID:</text>
        <text x="70" y="5">{parseInt(this.props.rfid)}%</text>
      </g>
    );
  }
}

export default Depot;
