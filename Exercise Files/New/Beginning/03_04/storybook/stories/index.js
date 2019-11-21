import React from 'react';
import { Text, View, ScrollView, PixelRatio, Animated, Easing, Image, Button } from 'react-native';
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

storiesOf('AndroidNavigationBar', module)
  .add('Red translucent', () => <AndroidNavigationBar backgroundColor="#ff0000" translucent={true} />)
  .add('Blue translucent', () => <AndroidNavigationBar backgroundColor="#0000ff" translucent={true} />)
  .add('Blue', () => <AndroidNavigationBar backgroundColor="#0000ff" />)
  .add('Red', () => <AndroidNavigationBar backgroundColor="#ff0000" />)
  ;

const ParentChildElevation = (props) => (
  <View>
    <Card elevation={5} style={{ position: 'absolute', left: 0, right: 0 }} />
    <Card elevation={6} style={{ position: 'absolute', left: 120, right: 20, top: 10, height: 60 }} />
    <Card elevation={3} style={{ position: 'absolute', left: 20, right: 100, top: 30, height: 80 }} />
    <Card elevation={4} style={{ position: 'absolute', left: 150, top: 90 }}>
      <Card elevation={7} />
    </Card>
    <ScrollView style={{ elevation: 5 }}>
      <View style={{ marginTop: 150 }} />
      {
        Array(20).fill(0).map((_, index) => (
          <Card elevation={index} />
        ))
      }
    </ScrollView>
  </View>
);


storiesOf('Measurement tests', module)
  .add('Font Scale', () => (
    <ScrollView>
      <Text style={{ fontSize: 20 }}>20sp</Text>
      <Text style={{ fontSize: 40 }}>40sp</Text>
      <Text style={{ fontSize: 80 }}>80sp</Text>
      <Text style={{ fontSize: 7 * PixelRatio.getFontScale() }}>fontSize: 7 * FontScale</Text>
      <Text style={{ fontSize: 80 / PixelRatio.getFontScale() }}>fontSize: 80 / FontScale</Text>
    </ScrollView>
  ))
  .add('Sizes', () => (
    <View>
      <View style={{ width: 100, height: 100, backgroundColor: 'red' }} />
      <View style={{ width: 200, height: 200, backgroundColor: 'yellow' }} />
    </View>
  ));

storiesOf('ArcMotion', module)
  .add('Test1', () => (
    <ArcMotionTest x={0} y={0} />
  ));

storiesOf('Animated tests', module)
  .add('Nested Animated.View', () => (
    <NestedAnimatedTest />
  ));

class NestedAnimatedTest extends React.Component {
  constructor(props) {
    super(props);
    this.progress = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.timing(this.progress, {
      toValue: 1,
      duration: 2000,
    }).start()
  }
  render() {
    const inputRange = [0, 1];
    const left = this.progress.interpolate({
      inputRange,
      outputRange: [100, 200],
    });
    const top = this.progress.interpolate({
      inputRange,
      outputRange: [100, 200],
    });
    const common = {
      position: 'absolute',
      right: null,
      bottom: null,
    };
    const square = { width: 50, height: 50, backgroundColor: 'red' };
    const animated = { left, top };
    return (
      <Animated.View style={[common, animated]}>
        <Text>Inside Animated</Text>
        <Animated.View style={[common, square, animated]} />
      </Animated.View>
    )
  }
}

class ArcMotionTest extends React.Component {
  constructor(props) {
    super(props);
    this.progress = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.timing(this.progress, {
      duration: 3000,
      toValue: 1,
    }).start();
  }
  animateTo({ x, y }) {
    const inputRange = [0, 1];
    const { props } = this;
    const left = this.progress.interpolate({
      inputRange,
      outputRange: [props.x, x],
      easing: Easing.bezier(0.5, 0, 0.5, 0),
    });
    const top = this.progress.interpolate({
      inputRange,
      outputRange: [props.y, y],
      // easing: Easing.bezier(0, 0.5, 0, 0.5),
    });
    return { left, top };
  }
  render() {
    const style = {
      position: 'absolute',
      left: this.props.x,
      top: this.props.y,
      width: 50,
      height: 50,
      right: null,
      bottom: null,
      backgroundColor: 'red',
    };
    const animatedStyle = this.animateTo({ x: 150, y: 300 });
    return (
      <Animated.View style={[style, animatedStyle]} />
    );
  }
}