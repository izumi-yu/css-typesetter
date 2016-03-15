import React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';

export default class DraggableText extends React.Component {
  componentWillReceiveProps(nextProps) {
    this.refs.draggable.setState({
      clientX: nextProps.start.x,
      clientY: nextProps.start.y
    });
  }

  render() {
    return (
      <Draggable ref="draggable" {...this.props}  handle=".draggable-text" >
      <ResizableBox
        refs="resizable"
        className="draggable-wrapper"
        width={this.props.width}
        height={this.props.height}
        draggableOpts={{grid: [5, 5]}}
        onResize={this.handleOnResize.bind(this)}
        onResizeStop={this.props.onResizeStop}
      >
      {this.props.children}
      </ResizableBox>
        </Draggable>
    );
  }

  handleOnResize(event, obj) {
    this.props.onResize(obj.size.width, obj.size.height);
  }
}

