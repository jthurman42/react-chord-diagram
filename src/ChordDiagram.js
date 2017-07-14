import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arc } from 'd3-shape';
import { ribbon, chord } from 'd3-chord';
import { scaleOrdinal } from 'd3-scale';
import { range, descending } from 'd3-array';

import Svg from './Svg';
import Groups from './Groups';
import Ribbons from './Ribbons';

export default class ChordDiagram extends Component {

    static propTypes = {
        matrix: PropTypes.array.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
        style: PropTypes.object,
        outerRadius: PropTypes.number,
        innerRadius: PropTypes.number,
        groupLabels: PropTypes.array,
        groupColors: PropTypes.array,
        padAngle: PropTypes.number,
        sortGroups: PropTypes.func,
        sortSubgroups: PropTypes.func,
        sortChords: PropTypes.func,
        labelColors: PropTypes.array,
        disableHover: PropTypes.bool,
    };

    static defaultProps = {
        matrix: [],
        width: 700,
        height: 700,
        style: {
            font: '10px sans-serif'
        },
        outerRadius: null,
        innerRadius: null,
        groupLabels: [],
        groupColors: [],
        padAngle: 0.05,
        sortGroups: null,
        sortSubgroups: descending,
        sortChords: null,
        labelColors: [],
        disableHover: false,
    };

    constructor (props) {

        super(props);

        this.setMouseOverGroup = this.setMouseOverGroup.bind(this);
    }

    state = {
        mouseOverGroup: null
    };

    setMouseOverGroup (mouseOverGroup) {

        this.setState({mouseOverGroup});
    }

  render() {

      const {
          matrix,
          width,
          height,
          style,
          groupLabels,
          groupColors,
          padAngle,
          sortGroups,
          sortSubgroups,
          sortChords,
          labelColors,
          disableHover,
      } = this.props;

      const outerRadius = this.props.outerRadius || Math.min(width, height) * 0.5 - 40;
      const innerRadius = this.props.innerRadius || outerRadius - 30;

      const d3Chord = chord()
          .padAngle(padAngle)
          .sortGroups(sortGroups)
          .sortSubgroups(sortSubgroups)
          .sortChords(sortChords);

      const chords = d3Chord(matrix);

      const d3Arc = arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);

      const d3Ribbon = ribbon()
          .radius(innerRadius);

      const color = scaleOrdinal()
          .domain(range(groupColors.length))
          .range(groupColors);

    return (
        <Svg width={width} height={height} style={style}>
            <Groups
                chords={chords}
                color={color}
                arc={d3Arc}
                outerRadius={outerRadius}
                setMouseOverGroup={this.setMouseOverGroup}
                groupLabels={groupLabels}
                labelColors={labelColors}
                disableHover={disableHover}
            />

            <Ribbons
                chords={chords}
                color={color}
                ribbon={d3Ribbon}
                mouseOverGroup={this.state.mouseOverGroup}
            />
        </Svg>
    );
  }
}