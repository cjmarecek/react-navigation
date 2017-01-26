/* @flow */

import React, { PureComponent } from 'react';
import {
  Animated,
  View,
  StyleSheet,
} from 'react-native';

import type {
  NavigationRoute,
  NavigationState,
} from '../../TypeDefinition';

type TabScene = {
  route: NavigationRoute;
  focused: boolean;
  index: number;
  tintColor?: string;
};

type Props = {
  activeTintColor: string;
  inactiveTintColor: string;
  scene: TabScene,
  position: Animated.Value;
  navigationState: NavigationState;
  renderIcon: (scene: TabScene) => React.Element<*>;
  style?: any;
};

export default class TabBarIcon extends PureComponent<void, Props, void> {
  props: Props;

  render() {
    const {
      position,
      scene,
      navigationState,
      activeTintColor,
      inactiveTintColor,
      style,
    } = this.props;
    const { route, index } = scene;
    const inputRange = navigationState.routes.map((x: any, i: number) => i);
    const activeOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
    });
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them.
    return (
      <View style={style}>
        <Animated.View style={[styles.icon, { opacity: activeOpacity }]}>
          {this.props.renderIcon({
            route,
            index,
            focused: true,
            tintColor: activeTintColor,
          })}
        </Animated.View>
        <Animated.View style={[styles.icon, { opacity: inactiveOpacity }]}>
          {this.props.renderIcon({
            route,
            index,
            focused: false,
            tintColor: inactiveTintColor,
          })}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them:
    // Cover the whole iconContainer:
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
