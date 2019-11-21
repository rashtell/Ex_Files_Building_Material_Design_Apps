import React from 'react';

import {
  NativeModules
} from 'react-native';

const { NavigationBar } = NativeModules;

class AndroidNavigationBar extends React.Component {
  componentDidMount() {
    NavigationBar.setColor(this.props.color);
  }
    
  render() {
    return null;
  }
}