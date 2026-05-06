import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Header from '../components/common/Header';
import {Colors} from '../theme/colours';

const Layout = ({children, style, contentContainerStyle, refreshControl, scrollable = true}) => {
  return (
    <View style={styles.container}>
      <Header />
      {scrollable ? (
        <ScrollView
          style={[{flex: 1}, style]}
          contentContainerStyle={[{flexGrow: 1}, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{flex: 1}, style]}>{children}</View>
      )}
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});