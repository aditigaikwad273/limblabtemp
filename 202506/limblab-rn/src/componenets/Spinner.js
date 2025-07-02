import React from "react"
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 10
  }
});

const Spinner = (props) => {
  const { title } = props;
  
  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Spinner;
