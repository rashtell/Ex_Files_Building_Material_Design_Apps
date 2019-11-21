// @flow
import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import ProductGallery from './ProductGallery';
import Toolbar from './Toolbar';

class ProductGalleryScreen extends Component {
    static contextTypes = {
        setActiveTransition: React.PropTypes.func,
        getActiveTransition: React.PropTypes.func,
    }
    render() {
        const toolbarActions = [
            { title: 'Settings', show: 'always', iconName: 'settings', iconColor: 'white' },
            // { title: 'Change duration', show: 'always', iconName: 'access-time', iconColor: 'white'},
        ];
        const onActionSelected = index => {
            switch (index) {
                case 0: this.props.navigation.navigate('Settings'); break;
                default: alert(`Invalid action index: ${index}`);
            }
        }
        return (
            <View>
                <Toolbar title="RN Gallery"
                    navigation={this.props.navigation}
                    actions={toolbarActions}
                    onActionSelected={onActionSelected}
                    />
                <ProductGallery {...this.props} />
            </View>
        )
    }
}


export default ProductGalleryScreen;