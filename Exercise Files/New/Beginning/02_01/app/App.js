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
import { Easing } from 'react-native';

const { createTransition, initTransition, together, sequence, Transitions } = Transition;

const SharedImage = initTransition(Transitions.SharedElement, /image-.+/);
const CrossFadeScenes = initTransition(Transitions.CrossFade, /\$scene-.+/);

const transitions = [
  { 
    from: 'ProductGallery', to: 'ProductDetail', 
    // [ SharedImage(0.7), 0.5 => CrossFadeScenes(0.2))] => ScaleFab(0.3)
    transition: sequence(SharedImage(0.9), CrossFadeScenes(0.1)),
    config: { duration: 650 },
  },
  { 
    from: 'ProductDetail', to: 'ProductGallery', 
    transition: sequence(CrossFadeScenes(0.1), SharedImage(0.9)), 
    config: { duration: 545 },
  },
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