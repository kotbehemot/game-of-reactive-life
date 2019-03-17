import React from 'react';
import LiveCell from './LiveCell.js'
import TrailCell from './TrailCell.js'

class CellGrid extends React.Component {

  constructor(props) {
    super(props);
    this.components = {
      live: LiveCell,
      trail: TrailCell
    }
  }

  render() {
    const cells = this.props.source;
    const TagName = this.components[this.props.cellType || 'trail'];
    return (
      <cell-grid>
        {cells.map(cell => (
          <TagName x={cell.x} y={cell.y} crowd={cell.crowd}
            key={`${cell.x},${cell.y}`}/>
          ))}
      </cell-grid>
    );
  }
}

export default CellGrid;
