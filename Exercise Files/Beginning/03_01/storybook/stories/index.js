import React from 'react';
import { Text, View, ScrollView, PixelRatio, Animated, Easing, Image, Button } from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import ProductGallery from '../../app/ProductGallery';
import ProductDetail from '../../app/ProductDetail';

import Data from '../../app/Data';

import Card from './Card';
import Fab from '../../app/Fab';
import AndroidNavigationBar from '../../AndroidNavigationBar';
import Spinner from 'react-native-spinkit';
import _ from 'lodash';


storiesOf('Gallery', module)
  .add('with products', () => <ProductGallery />);

storiesOf('Detail', module)
  .add('Initial product', () => (
    <ProductDetail.Comp product={Data.oneProduct()} />
  ))
  .add('Two line title', () => (
    <ProductDetail.Comp product={{
      ...Data.oneProduct(),
      title: 'two line. this name is pretty long, pretty pretty long'
    }} />
  ))
  .add('Dark image', () => (
    <ProductDetail.Comp product={{
      ...Data.oneProduct(),
      image: require('../../app/images/img6.jpg'),
    }} />
  ))
  .add('Light image', () => (
    <ProductDetail.Comp product={{
      ...Data.oneProduct(),
      image: require('../../app/images/img1.jpg'),
    }} />
  ));

storiesOf('Elevations', module)
  
  // .add('Text', () => (
  //   <Text style={{
  //     elevation: 5,
  //     fontSize: 50,
  //     margin: 30,
  //     borderRadius: 20,
  //     backgroundColor: 'white'
  //   }}>Foo</Text>
  // ))
  // .add('Image', () => (
  //   <Image source={require('../../app/images/img6.jpg')}
  //     style={{
  //       elevation: 5,
  //       width: 350,
  //       height: 350,
  //       margin: 30,
  //       backgroundColor: '#FFFFFFFF'
  //     }} />
  // ))
  // .add('Parent children', () => (
  //   <View>
  //     <Card elevation={5}>
  //       <Card elevation={10} />
  //     </Card>
  //     <Card elevation={6}>
  //       <Card elevation={2} />
  //     </Card>
  //   </View>
  // ))
  ;