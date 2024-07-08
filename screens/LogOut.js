import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';

export default class LogOutScreen extends React.Component {
  componentDidMount() {
    firebase.auth().signOut();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>LOGOUT</Text>
      </View>
    );
  }
}

