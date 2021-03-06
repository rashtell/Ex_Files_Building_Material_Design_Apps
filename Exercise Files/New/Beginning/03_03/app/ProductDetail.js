// @flow
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  Easing,
  ListView,
  Button,
} from 'react-native';
import _ from 'lodash';

import LinearGradient from 'react-native-linear-gradient';
import Fab from './Fab';

///////// CONSTANTS ////////
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

// initial aspect ratio 4:3, collapsed: 16:9
const HERO_WIDTH = WINDOW_WIDTH;
const HERO_HEIGHT = WINDOW_WIDTH * 3 / 4;

const FAB_COLOR = '#ff6f00';

//////////// ProductDetail main component /////////

class ProductDetail extends React.PureComponent {
  render() {
    const { product } = this.props;
    const { url, title, description, image, price, comments } = product;
    const renderHeader = () => (
      <View>
        <View ref={(v) => this._title = v} style={styles.titleContainer} >
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    );
    return (
      <View style={styles.window}>
        <View>
          <Image source={image} style={[styles.heroImage,]} />
          <Price price={price} style={styles.priceContainer} />
        </View>
        <ListView dataSource={dsComments.cloneWithRows(comments)}
          renderRow={renderComment}
          renderHeader={renderHeader}
        />
        <Fab icon='add-shopping-cart' backgroundColor={FAB_COLOR} style={styles.fab} />
      </View>
    );
  }
}

const Price = ({ price, style }) => (
  <LinearGradient colors={['#00000000', '#00000044', '#00000088']} style={[style]}>
    <Text style={styles.priceText}>${price}</Text>
  </LinearGradient>
);

//////// COMMENTS //////////

const renderComment = ({ author, comment, avatar, time }) => (
  <View style={commentStyles.container}>
    <Image source={avatar} style={commentStyles.avartar} />
    <View style={commentStyles.textContainer}>
      <View style={commentStyles.authorContainer}>
        <Text>{author}</Text>
        <Text>{time}</Text>
      </View>
      <Text style={commentStyles.text}>{comment}</Text>
    </View>
  </View>
);

const dsComments = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

///////////// Stylesheets ////////////////

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  fullScreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  heroImage: {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
  },
  priceContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
  priceText: {
    color: 'white',
  },
  titleContainer: {
    backgroundColor: '#efefef',
  },
  titleText: {
  },
  descriptionText: {
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
})

const avartarSize = 40;
const commentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avartar: {
    width: avartarSize,
    height: avartarSize,
    borderRadius: avartarSize / 2,
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  textContainer: {
  },
  text: {
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});


const Screen = ({ navigation }) => (
  <ProductDetail product={navigation.state.params.product} />
);

export default {
  Comp: ProductDetail,
  Screen,
}