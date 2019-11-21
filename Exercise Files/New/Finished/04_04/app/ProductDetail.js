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

const DIALOG_WIDTH = metrics.baselineGrid * 40;
const DIALOG_HEIGHT = DIALOG_WIDTH * 9 / 16;
const FAB_SIZE = metrics.fabSize;
// make the container slightly bigger so that it doesn't cut FAB's shadow.
const FAB_CONTAINER_INIT_SIZE = FAB_SIZE + 40;
const FAB_COLOR = '#ff6f00';

const TOOLBAR_ICON_COLOR_LIGHT = '#FEFEFE';
const TOOLBAR_ICON_COLOR_DARK = '#222222';


//////////// ProductDetail main component /////////

class ProductDetail extends React.PureComponent {
  state: {
    statusBarColor: string,
    statusBarStyle: 'default' | 'light-content' | 'dark-content',
    toolbarIconColor: string,
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
        <View ref={(v) => this._title = v} style={styles.titleContainer} onLayout={this._onLayout}>
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
    const { titleMetrics } = this.state;
    const initialFabTop = titleMetrics && (titleMetrics.y + titleMetrics.height - FAB_CONTAINER_INIT_SIZE / 2);
    const fabStyle = [{ top: initialFabTop }, getFabStyleOnScroll(this._scrollY, titleMetrics && titleMetrics.height)];
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
          onScroll={(e) => this._scrollY.setValue(e.nativeEvent.contentOffset.y)}
          renderRow={renderComment}
          renderHeader={renderHeader}
        />
        <FabDialogCombo id='fab-cart' style={fabStyle} />
        <Toolbar icon="arrow-back" iconColor={this.state.toolbarIconColor} floating />
        <AndroidNavigationBar translucent={false} />
      </View>
    );
  }
}

const Price = ({ price, style }) => (
  <LinearGradient colors={['#00000000', '#00000044', '#00000088']} style={[style]}>
    <Text id='price' style={styles.priceText}>${price}</Text>
  </LinearGradient>
);

//////// COMMENTS //////////

const renderComment = ({ author, comment, avatar, time }) => (
  <View id='pdcontent-comment' style={commentStyles.container}>
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

///////////// Animate hero image and FAB on scroll ////////////////

const getHeroStyleOnScroll = (scrollY: Animated.Value) => {
  const offsetYWhenCollapsed = HERO_DELTA_Y_COLLAPSED / 2;
  const inputRange = [0, HERO_DELTA_Y_COLLAPSED, HERO_DELTA_Y_COLLAPSED + 0.1];
  const height = scrollY.interpolate({
    inputRange,
    outputRange: [HERO_HEIGHT, HERO_HEIGHT_COLLAPSED + offsetYWhenCollapsed, HERO_HEIGHT_COLLAPSED + offsetYWhenCollapsed],
  });
  const translateY = scrollY.interpolate({
    inputRange,
    outputRange: [0, -offsetYWhenCollapsed, -offsetYWhenCollapsed],
  });
  const elevation = scrollY.interpolate({
    inputRange,
    outputRange: [1, HERO_ELEVATION_COLLAPSED, HERO_ELEVATION_COLLAPSED],
  });

  return {
    height,
    elevation,
    backgroundColor: 'white',
    transform: [
      { translateY },
    ]
  }
}

const getFabStyleOnScroll = (scrollY, titleHeight = 0) => {
  const fabYWhenHeroCollapsed = HERO_DELTA_Y_COLLAPSED + titleHeight;
  const translateY = scrollY.interpolate({
    inputRange: [0, fabYWhenHeroCollapsed, fabYWhenHeroCollapsed + 0.1],
    outputRange: [0, -fabYWhenHeroCollapsed, -fabYWhenHeroCollapsed],
  })
  return {
    transform: [
      { translateY },
    ]
  }
}

//////////// Fab and dialog component /////////

class FabDialogCombo extends React.PureComponent {
  state: {
    dialogActivated: boolean,
  }
  constructor(props) {
    super(props);
    this.state = {
      dialogActivated: false,
    }
    this._dialogTransformProgress = new Animated.Value(this.state.dialogActivated ? 1 : 0);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.dialogActivated !== prevState.dialogActivated) {
      Animated.timing(this._dialogTransformProgress, {
        toValue: this.state.dialogActivated ? 1 : 0,
        duration: 375,
      }).start(() => {
        if (this.state.dialogActivated === false) this.setState({ containerOrigin: null });
      });
    }
  }
  render() {
    const onFabPress = async () => {
      const containerOrigin = await measureInWindow(this._fabContainer);
      this.setState({ dialogActivated: true, containerOrigin });
    };
    const onBackgroundPress = () => this.setState({ dialogActivated: false });
    const AnimatedFab = Animated.createAnimatedComponent(Fab);
    const animatedModalStyle = {
      elevation: metrics.elevation.appBar + 1,
      backgroundColor: this._dialogTransformProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
      }),
      transform: [
        {
          translateY: this._dialogTransformProgress.interpolate({
            inputRange: [0, 0.1, 1],
            outputRange: [-10000, 0, 0], // move it offscreen initially so that it doesn't block touches
          })
        }
      ]
    };
    const dialogStyleOnTransform = getDialogStyleOnTransform(this._dialogTransformProgress);
    const origin = this.state.containerOrigin;
    const fabContainerStyleOnTransform = getFabContainerStyleOnTransform(this._dialogTransformProgress, origin);
    const fabContainerStyle = [styles.fabContainer, this.props.style, fabContainerStyleOnTransform];
    return (
      <View style={[styles.fullScreen, { justifyContent: 'center' }]}>
        <TouchableWithoutFeedback onPress={onBackgroundPress}>
          <Animated.View style={[styles.fullScreen, animatedModalStyle]} />
        </TouchableWithoutFeedback>
        <Animated.View style={fabContainerStyle} ref={v => this._fabContainer = v} >
          <AnimatedFab icon='add-shopping-cart' backgroundColor={FAB_COLOR}
            style={[styles.fab, getFabStyleOnTransform(this._dialogTransformProgress)]}
            onPress={onFabPress} />
          <Animated.View style={[styles.dialog, dialogStyleOnTransform]}
            pointerEvents='box-none'>
            <Text style={{ marginBottom: 50 }}>Please log in first!</Text>
            <Button title="LOG IN" color={FAB_COLOR} onPress={() => console.log("Log in pressed.")} />
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}

//////////// Transform dialog functions /////////

// Transform: move (with slight zoom) ==> zoom ==> fade

const MOVE_END = 0.2;
const TRANSFORM_END = 0.7;
const SIZE_RATIO_WHEN_MOVE_END = 1.5;

const getFabStyleOnTransform = (progress: Animated.Value) => {
  const maxSize = Math.sqrt(Math.pow(DIALOG_WIDTH / 2, 2) + Math.pow(DIALOG_HEIGHT / 2, 2)) * 2;
  const inputRange = [0, MOVE_END, TRANSFORM_END, 1];

  // TODO exercise
  //  Animate opacity, width and height
  const opacity = 1;
  const width = FAB_SIZE;
  const height = width;

  // TODO exercise
  // Animate backgroundColor to #FAFAFA to make the FAB blends to the dialog content better
  const backgroundColor = FAB_COLOR;

  return {
    opacity,
    width,
    height,
    borderRadius: maxSize / 2,
    backgroundColor,
  }
}

const getDialogStyleOnTransform = (progress: Animated.Value) => {
  // TODO exercise: 
  //   Fade in the dialog in the Fade phase
  const opacity = 0;
  return {
    opacity,
  };
}

const getFabContainerStyleOnTransform = (progress: Animated.Value, origin) => {
  const inputRange = [0, MOVE_END, TRANSFORM_END, 1];
  const sizeWhenMoveEnds = FAB_CONTAINER_INIT_SIZE * SIZE_RATIO_WHEN_MOVE_END;
  const width = progress.interpolate({
    inputRange,
    outputRange: [FAB_CONTAINER_INIT_SIZE, sizeWhenMoveEnds, DIALOG_WIDTH, DIALOG_WIDTH],
  });
  const height = progress.interpolate({
    inputRange,
    outputRange: [FAB_CONTAINER_INIT_SIZE, sizeWhenMoveEnds, DIALOG_HEIGHT, DIALOG_HEIGHT],
  });
  let styleWhenDialogActivated = {};
  if (origin) {
    // move the fab container to target when progress is 1, and back when progress is 0.
    const dialogPos = {
      left: (WINDOW_WIDTH - DIALOG_WIDTH) / 2,
      top: (WINDOW_HEIGHT - DIALOG_HEIGHT) / 2,
    }
    const targetWhenMoveEnds = {
      left: (WINDOW_WIDTH - sizeWhenMoveEnds) / 2,
      top: (WINDOW_HEIGHT - sizeWhenMoveEnds) / 2,
    }
    const left = progress.interpolate({
      inputRange,
      outputRange: [origin.x, targetWhenMoveEnds.left, dialogPos.left, dialogPos.left],
    });
    const top = progress.interpolate({
      inputRange,
      outputRange: [origin.y, targetWhenMoveEnds.top, dialogPos.top, dialogPos.top],
    });
    styleWhenDialogActivated = {
      left,
      top,
      transform: [], // cancel out translateY set in getFabContainerStyleOnScroll()
    };
  }

  return {
    width,
    height,
    ...styleWhenDialogActivated,
  }
}

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
  dialog: {
    backgroundColor: '#FAFAFA',
    elevation: metrics.elevation.dialog,
    alignSelf: 'center',
    paddingLeft: metrics.baselineGrid * 8,
    paddingRight: metrics.baselineGrid * 8,
    paddingTop: metrics.baselineGrid * 4,
    paddingBottom: metrics.baselineGrid * 4,
    width: DIALOG_WIDTH,
    height: DIALOG_HEIGHT,
    justifyContent: 'center',
    opacity: 0,
    // alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  fabContainer: {
    position: 'absolute',
    right: -4,
    elevation: metrics.elevation.fabResting,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  fab: {
  },
  toolbarHeart: {
    width: 160,
    height: 160,
    marginRight: -64,
  }
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