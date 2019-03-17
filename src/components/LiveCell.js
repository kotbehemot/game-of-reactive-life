import React from 'react';
import '../assets/styles/LiveCell.scss';

const CELL_SIZE = 20;

class LiveCell extends React.Component {
  render() {
    const { x, y, crowd } = this.props;
    return (
      <live-cell style={{
        backgroundColor: `${crowd === 3 ? "#9c9": "#ada"}`,
        left:   `${CELL_SIZE * x + 1}px`,
        top:    `${CELL_SIZE * y + 1}px`,
        width:  `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
      }} />
    );
  }
}

export default LiveCell;
