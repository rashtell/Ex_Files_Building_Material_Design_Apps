import React from 'react';
import { Text, View, ScrollView, PixelRatio, Animated, Easing, Image, Button, StyleSheet, TouchableOpacity, Slider } from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import ProductGallery from '../../app/ProductGallery';
import ProductDetail from '../../app/ProductDetail';

import Data from '../../app/Data';

import Card from './Card';
import Fab from '../../app/Fab';
import AndroidNavigationBar from '../../AndroidNavigationBar';

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

storiesOf('Fab', module)
  .add('Fab Initial', () => (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Fab icon='add-shopping-cart' backgroundColor='white' iconColor='#222222'
        onPress={() => console.log('Fab pressed')} />
    </View>
  ));

storiesOf('Elevation tests', module)
  .add('View', () => (
    // <View style={{ elevation: 3, width: 350, height: 350, margin: 40 }} />
    <View style={{ elevation: 3, width: 350, height: 350, margin: 40, backgroundColor: '#FFFFFFFF' }} />
    // <View style={{ elevation: 3, width: 350, height: 350, margin: 40, backgroundColor: '#FFFFFF22' }} />
    // <View style={{ elevation: 3, width: 350, height: 350, margin: 40, backgroundColor: '#FFFFFFFF', borderRadius: 20 }} />
  ))
  .add('Text', () => (
    <Text style={{ elevation: 5, fontSize: 50, margin: 30, borderRadius: 20, backgroundColor: 'white' }}>Foo</Text>
  ))
  .add('Image', () => (
    <Image source={require('../../app/images/img6.jpg')} style={{ elevation: 5, width: 350, height: 350, margin: 30, backgroundColor: '#FFFFFFFF' }} />
  ))
  .add('Rounded Image', () => (
    <Image source={require('../../app/images/img6.jpg')} style={{ elevation: 5, width: 350, height: 350, margin: 30, borderRadius: 20, backgroundColor: '#FFFFFFFF' }} />
  ))
  .add('Rounded image in a view', () => (
    <View style={{ elevation: 9, width: 350, height: 350, margin: 40, backgroundColor: '#FFFFFFFF', borderRadius: 20 }}>
      <Image source={require('../../app/images/img6.jpg')} style={{ width: 350, height: 350, borderRadius: 20 }} />
    </View>
  ))
  .add('One card', () => <Card elevation={1} />)
  .add('In the same parent', () => (
    <View>
      <Card elevation={1} />
      <Card elevation={15} />
      <Card elevation={5} />
    </View>
  ))
  .add('Parent children', () => (
    <View>
      <Card elevation={5}>
        <Card elevation={10} />
      </Card>
      <Card elevation={6}>
        <Card elevation={2} />
      </Card>
    </View>
  ))
  .add('position: absolute', () => (
    <View>
      <Card elevation={4} style={{ position: 'absolute' }} extraText="positoin: absolute" />
      <Card elevation={5} />
      <Card elevation={3} />
    </View>
  ))
  ;

storiesOf('Animated', module)
  .add('Animated experiments', () => (
    <AnimatedTest />
  ))
  ;

class AnimatedTest extends React.Component {
  render() {
    const progress = new Animated.Value(0);
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-200, 200],
    });
    const width = progress.interpolate({
      inputRange:  [0, 0.5, 1],
      outputRange: [50, 150, 150],
    });
    const height = width;
    const onPress = () => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }).start();
    };
    const onSliderChange = (v) => {
      progress.setValue(v);
    }

    return (
      <View style={styles.imageContainer}>
        <Animated.Image style={[styles.image, { width, height, transform: [{ translateX }] }]}
          source={require('../../app/images/img1.jpg')} />
        <Button title='Animate!' onPress={onPress} />
        <Slider style={styles.slider}
          minimumValue={0} maximumValue={1}
          onValueChange={onSliderChange}
        />
      </View>
    )
  }
}



const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    elevation: 6,
    margin: 50,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    margin: 50,
    width: 300,
    height: 50,
  }
})