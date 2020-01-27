import React from 'react';

class KeyboardListener extends React.PureComponent {
  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('wheel', this.onWheel);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('wheel', this.onWheel);
  }
  onWheel = ({deltaY}) => {
    if (deltaY > 0) {
      this.props.next();
    } else if (deltaY < 0) {
      this.props.prev();
    }
  };
  onKeyDown = ({keyCode}) => {
    const ARROW_LEFT = 37;
    const ARROW_RIGHT = 39;
    const ARROW_TOP = 38;
    const ARROW_BOTTOM = 40;
    switch (keyCode) {
      case ARROW_LEFT:
      case ARROW_TOP:
        this.props.prev();
        break;
      case ARROW_RIGHT:
      case ARROW_BOTTOM:
        this.props.next();
        break;
      default:
        null;
    }
  };
  render() {
    return null;
  }
}

export default KeyboardListener;
