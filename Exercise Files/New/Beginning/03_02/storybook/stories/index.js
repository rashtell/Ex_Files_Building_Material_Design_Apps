import React from 'react';
import { Text, View, ScrollView, PixelRatio, Animated, Easing, Image, Button } from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import ProductGalleryScreen from '../../app/ProductGalleryScreen';
import ProductDetail from '../../app/ProductDetail';

import Data from '../../app/Data';


storiesOf('Hello Storybook', module)
  .add('Hello', () => <Text>Hello Storybook</Text>);

storiesOf('Gallery', module)
  .add('with products', () => <ProductGalleryScreen />);

storiesOf('Detail', module)
  .add('Light image', () => (
    <ProductDetail.Comp product={{
      ...Data.oneProduct(),
      image: require('../../app/images/img1.jpg'),
    }} />
  ));