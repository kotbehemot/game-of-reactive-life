import React from 'react';
import '../assets/styles/TrailCell.scss';

const CELL_SIZE = 20;

class TrailCell extends React.Component {
  render() {
    const { x, y } = this.props;
    return (
      <trail-cell style={{
        left:   `${CELL_SIZE * x + 1}px`,
        top:    `${CELL_SIZE * y + 1}px`,
        width:  `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
      }} />
    );
  }
}

export default TrailCell;
