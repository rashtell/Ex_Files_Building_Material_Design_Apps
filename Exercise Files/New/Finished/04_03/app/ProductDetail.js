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
  PanResponder,
  Button,
  TouchableWithoutFeedback,
  UIManager,
  findNodeHandle,
  StatusBar,
} from 'react-native';
import _ from 'lodash';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animation from 'lottie-react-native';
import { Transition } from 'react-navigation';

import Touchable from './Touchable';
import Toolbar from './Toolbar';
import Fab from './Fab';

import PeekPalette from '../PeekPalette';
import { metrics, fonts } from './MaterialValues';
import AndroidNavigationBar from '../AndroidNavigationBar';

///////// CONSTANTS ////////
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

// initial aspect ratio 4:3, collapsed: 16:9
const HERO_WIDTH = WINDOW_WIDTH;
const HERO_HEIGHT = WINDOW_WIDTH * 3 / 4;
const HERO_HEIGHT_COLLAPSED = WINDOW_WIDTH * 9 / 16;
const HERO_DELTA_Y_COLLAPSED = HERO_HEIGHT - HERO_HEIGHT_COLLAPSED;
const HERO_ELEVATION_COLLAPSED = metrics.elevation.appBar - 1;

const FAB_SIZE = metrics.fabSize;
const FAB_COLOR = '#ff6f00';

const TOOLBAR_ICON_COLOR_LIGHT = '#FEFEFE';
const TOOLBAR_ICON_COLOR_DARK = '#222222';


//////////// ProductDetail main component /////////

class ProductDetail extends React.PureComponent {
  state: {
    statusBarColor: string,
    statusBarStyle: 'default' | 'light-content' | 'dark-content',
    toolbarIconColor: string,
    heartProgress: Animated.Value,
    titleMetrics: Object,
  }
  constructor(props) {
    super(props);
    this._onLayout = this._onLayout.bind(this);
    this._scrollY = new Animated.Value(0);
    this.state = {
      statusBarColor: '#6200EA',
      statusBarStyle: 'default',
      toolbarIconColor: TOOLBAR_ICON_COLOR_LIGHT,
      heartProgress: new Animated.Value(0),
    };
  }
  async _onLayout() {
    try {
      const titleMetrics = await measureInWindow(this._title);
      this.setState({ titleMetrics });
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const { product } = this.props;
    const { url, title, description, image, price, comments } = product;
    const renderHeader = () => (
      <View style={{ marginTop: HERO_HEIGHT }}>
        <View style={styles.titleContainer}>
          <Text id='pdcontent-title' style={styles.titleText}>{title}</Text>
        </View>
        <Text id='pdcontent-description' style={styles.descriptionText}>{description}</Text>
      </View>
    );
    const onPaletteReady = swatches => {
      if (swatches && swatches.length > 0) {
        const popularSwatch = swatches[0];
        // console.log('swatches', popularSwatch);
        // Dynamically changing to dark-content status bar style is only supported on Android M+
        const statusBarStyle = popularSwatch.theme === 'light' ? 'dark-content' : 'light-content'
        this.setState({
          statusBarColor: popularSwatch.scrimColor,
          statusBarStyle,
          toolbarIconColor: popularSwatch.theme === 'light' ? TOOLBAR_ICON_COLOR_DARK : TOOLBAR_ICON_COLOR_LIGHT,
        });
      }
    };
    const titleHeight = 8 * metrics.baselineGrid;
    const initialFabTop = HERO_HEIGHT + titleHeight - FAB_SIZE / 2;
    const fabStyle = [{ top: initialFabTop }, getFabStyleOnScroll(this._scrollY, titleHeight)];
    return (
      <View style={styles.window}>
        <StatusBar backgroundColor={this.state.statusBarColor} barStyle={this.state.statusBarStyle} />
        <Animated.View style={getHeroStyleOnScroll(this._scrollY)}>
          <PeekPalette onPaletteReady={onPaletteReady} region="0%,0%,100%,5%">
            <Image id={`image-${url}`} source={image} style={[styles.heroImage,]} />
          </PeekPalette>
          <Price price={price} style={styles.priceContainer} />
        </Animated.View>
        <ListView dataSource={dsComments.cloneWithRows(comments)}
          style={styles.fullScreen}
          onScroll={(e) => {
            console.log(e.nativeEvent.contentOffset.y)
            this._scrollY.setValue(e.nativeEvent.contentOffset.y)
          }}
          renderRow={renderComment}
          renderHeader={renderHeader}
        />
        <Fab icon='add-shopping-cart' backgroundColor={FAB_COLOR} style={[styles.fab, fabStyle]} />
        <Toolbar icon="arrow-back" iconColor={this.state.toolbarIconColor} floating />
        <AndroidNavigationBar translucent={false} />
      </View>
    );
  }
}

const Price = ({ price, style }) => (
  <LinearGradient colors={['#00000000', '#00000044', '#00000088']} style={[style]}>
    <Transition.Text id='price' style={styles.priceText}>${price}</Transition.Text>
  </LinearGradient>
);

//////// COMMENTS //////////

const renderComment = ({ author, comment, avatar, time }) => (
  <Transition.View id='pdcontent-comment' style={commentStyles.container}>
    <Image source={avatar} style={commentStyles.avartar} />
    <View style={commentStyles.textContainer}>
      <View style={commentStyles.authorContainer}>
        <Text>{author}</Text>
        <Text>{time}</Text>
      </View>
      <Text style={commentStyles.text}>{comment}</Text>
    </View>
  </Transition.View>
);

const dsComments = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

///////////// Animate hero image and FAB on scroll ////////////////

const getHeroStyleOnScroll = (scrollY: Animated.Value) => {
  // TODO I'll leave this as an excercise.
  return {}
}

const getFabStyleOnScroll = (scrollY, titleHeight) => {
  const fabYStop = HERO_HEIGHT - HERO_HEIGHT_COLLAPSED + titleHeight;
  const translateY = scrollY.interpolate({
    inputRange: [0, fabYStop, fabYStop + 1],
    outputRange: [0, -fabYStop, -fabYStop],
  });
  return {
    transform: [
      { translateY }
    ]
  };
}



// const fabYStop = HERO_HEIGHT - HERO_HEIGHT_COLLAPSED + titleHeight;


//////////// Shared Functions /////////

const measureInWindow = (ref) => {
  return new Promise((resolve, reject) => {
    const tag = findNodeHandle(ref);
    UIManager.measureInWindow(tag, (x, y, width, height) => {
      if ([x, y, width, height].every(n => _.isNumber(n))) {
        resolve({ x, y, width, height });
      } else {
        reject(`Failed to measure ${tag}. x=${x}, y=${y}, width=${width}, height=${height}`);
      }
    });
  });
}

///////////// Stylesheets ////////////////

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  heroImage: {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
  },
  titleContainer: {
    backgroundColor: '#efefef',
    padding: metrics.screenEdgeMarginHorizontal,
  },
  titleText: {
    ...fonts.sizes.headline,
    ...fonts.families.sansSerifCondensed
  },
  descriptionText: {
    ...fonts.sizes.body2,
    margin: metrics.screenEdgeMarginHorizontal,
  },
  fullScreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  priceContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    paddingLeft: metrics.screenEdgeMarginHorizontal,
    paddingRight: metrics.screenEdgeMarginHorizontal,
    paddingTop: metrics.gutterVertical,
    paddingBottom: metrics.gutterVertical,
  },
  priceText: {
    ...fonts.sizes.display1,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    right: metrics.screenEdgeMarginHorizontal,
  },
})

const avartarSize = metrics.baselineGrid * 5;
const commentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: metrics.screenEdgeMarginHorizontal,
    marginRight: metrics.screenEdgeMarginHorizontal,
    height: metrics.baselineGrid * 9,
  },
  avartar: {
    width: avartarSize,
    height: avartarSize,
    borderRadius: avartarSize / 2,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    marginRight: metrics.gutterHorizontal,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    ...fonts.sizes.body1,
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