// @flow
import React, { Component } from 'react';
import {
  ListView,
  Image,
  View,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';

import { Transition } from 'react-navigation';
import Touchable from './Touchable';
import Data from './Data';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

const colCount = 3;

const { width: windowWidth } = Dimensions.get("window");
const margin = 2;
const productWidth = (windowWidth - margin * colCount * 2) / colCount;

const products = Data.getProducts();
const productRows = _.chunk(products, colCount);

console.log('======================> productRows', productRows.length, productRows[0].length)

class ProductGallery extends Component {
  render() {
    return (
      <ListView
        dataSource={ds.cloneWithRows(productRows)}
        renderRow={this.renderRow.bind(this)}
      />);
  }
  renderRow(products) {
    return (
      <View style={styles.row}>
        {products.map(this.renderCell.bind(this))}
      </View>
    )
  }
  renderCell(product) {
    const onProductPressed = product => this.props.navigation.navigate('ProductDetail', { product });
    return (
      <Touchable onPress={() => onProductPressed(product)} key={product.url}>
        <View style={styles.cell}>
          <Transition.Image id={`image-${product.url}`} source={product.image} style={styles.image} />
        </View>
      </Touchable>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    margin: 2,
  },
  image: {
    width: productWidth,
    height: productWidth,
  }
})

export default ProductGallery;