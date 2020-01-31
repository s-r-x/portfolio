import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {closeMenu} from '@/store/slice/menu';

class RouteWatcher extends React.Component {
  componentDidMount() {
    this.props.history.listen(this.onChange);
  }
  onChange = () => {
    if (this.props.isMenuOpen) {
      this.props.closeMenu();
    }
  };
  render() {
    return null;
  }
}

const mapState = ({menu}) => ({
  isMenuOpen: menu.isOpen,
});
const mapDispatch = dispatch => ({
  closeMenu: () => dispatch(closeMenu()),
});

export default withRouter(
  connect(
    mapState,
    mapDispatch,
  )(RouteWatcher),
);
