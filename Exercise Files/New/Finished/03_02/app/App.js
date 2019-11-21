// @flow
import React, { Component } from 'react';
import {
  View,
  StatusBar,
} from 'react-native';

import {
  StackNavigator, Transition,
} from 'react-navigation';

import ProductGallery from './ProductGallery';
import ProductDetail from './ProductDetail';

import _ from 'lodash';

const { createTransition, together, Transitions } = Transition;

const SharedImage = createTransition(Transitions.SharedElement, /image-.+/);

const transitions = [
  { from: 'ProductGallery', to: 'ProductDetail', transition: SharedImage },
  { from: 'ProductDetail', to: 'ProductGallery', transition: SharedImage },
];

const App = StackNavigator({
  ProductGallery: {
    screen: ProductGallery,
  },
  ProductDetail: {
    screen: ProductDetail.Screen,
  }
}, {
    transitions,
    headerMode: 'none',
  });

export default App;