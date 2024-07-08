import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  Clipboard,
  Alert,
  
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { FlatList } from 'react-native-gesture-handler';
import db from '../config';
import firebase from 'firebase';
import { Card } from 'react-native-paper';

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      final_data: [],
      light_theme: '',
      like: 0,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this.db1();
    this.fetchUser();
    this._loadFontsAsync();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.name !== this.state.final_data) {
      this.db1();
    }
  }

  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
      });
    this.setState({
      light_theme: theme === 'light' ? true : false
    });
  }

  db1 = async () => {
    //console.log('check db');
    var all_data = [];

    var bkresponse;
    const bookRef = await db.collection('Data').get();

    bookRef.docs.map((doc) => {
      bkresponse = doc.data();
      all_data.push(bkresponse);
    });
    this.setState({ final_data: all_data });
    console.log(all_data);
  };
  like = async () => {
    this.setState({ like: this.state.like + 1 });
    var snapshot = await db
      .collection('Data')
      .limit(3)
      .where('name', '==', item.name)
      .get();
    const doc = snapshot.docs[0];
    doc.ref.update({
      like: this.state.like,
    });
  };
  render() {
    console.log(this.state.light_theme)
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      const Data = this.state.final_data;

      return (
        <View
          style={this.state.light_theme ? styles.container2 : styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleText2
                    : styles.appTitleText
                }>
                Storytelling App
              </Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <FlatList
              data={Data}
              renderItem={({ item }) => {
                return (
                  <View style={this.state.light_theme ? styles.flatview2 : styles.flatview}>
                    <TouchableOpacity style={styles.button2} onPress={()=>{ this.props.navigation.navigate("StoryScreen") }}>
                   
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: 300,
                          height: 150,
                          borderRadius: 20,
                          alignSelf: 'center',
                          marginTop:20
                        }}></Image> 

                      <Text
                        style={
                          this.state.light_theme ? styles.title2 : styles.title
                        }>
                        {item.title}
                      </Text>
                      <Text
                        style={
                          this.state.light_theme ? styles.name2 : styles.name
                        }>
                        By {item.name}{' '}
                      </Text>
                      <Text
                        style={
                          this.state.light_theme ? styles.des2 : styles.des
                        }>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={
                          like = async () => {
                          this.setState({ like: this.state.like + 1 })
                            var snapshot = await db
                              .collection('Data')
                              .limit(100)
                              .where('name', '==', item.name)
                              .get();
                            const doc = snapshot.docs[0];
                            doc.ref.update({
                              like: this.state.like,
                            });
                          }
                        }>
                        <Image
                          source={{
                            uri:
                              item.like === 1
                                ? 'https://o.remove.bg/downloads/6fa10b7a-fc5c-4527-bb03-b74f59a55ad8/132-1324942_green-like-png-removebg-preview.png'
                                : 'https://o.remove.bg/downloads/ec0c3612-75e3-441e-bf85-548b86cd2e5b/like-button-social-media-image-facebook-messenger-png-favpng-YkquKiF4ePG3tMC0eT3hxUfgS-removebg-preview-removebg-preview.png',
                          }}
                          style={{ width: 50, height: 50, marginLeft: 50 }}
                        />
                      </TouchableOpacity>
                      <Text
                        style={
                          this.state.light_theme ? styles.des2 : styles.des
                        }>
                        {item.like}
                      </Text>
                      <TouchableOpacity onPress={()=>{ Alert.alert('link of app was copied to clipboard'),Clipboard.setString('https://snack.expo.dev/@hardik.123/story-telling-app-hardik-5')}}>
                        <Image
                          source={require('../png-transparent-computer-icons-share-icon-font-awesome-search-button-miscellaneous-angle-hand-removebg-preview.png')}
                          style={{ width: 50, height: 50, marginLeft: 80 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  cardContainer: {
    flex: 0.85,
  },
  button2: {
    borderRadius: 30,
    alignSelf: 'center',
  },

  title: {
    fontSize: RFValue(25),
    fontWeight: 'bold',
    margin: 2,
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
  },
  des: {
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
    margin: 2,
  },
  name: {
    fontSize: RFValue(18),
    fontWeight: 'bold',

    fontFamily: 'Bubblegum-Sans',
    color: 'white',
  },
  name2: {
    fontSize: RFValue(18),
    fontWeight: 'bold',

    fontFamily: 'Bubblegum-Sans',
    color: 'black',
  },
  des2: {
    fontSize: 13,
    fontWeight: 'bold',
    margin: 2,
    fontFamily: 'Bubblegum-Sans',
    color: 'black',
  },
  title2: {
    fontSize: RFValue(25),
    fontWeight: 'bold',

    fontFamily: 'Bubblegum-Sans',
    color: 'black',
  },
  appTitleText2: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  container2: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatview:{
  marginTop: 50, borderRadius: 20,backgroundColor:'#2f345d' 
  },
  flatview2:{
  marginTop: 50, borderRadius: 20,backgroundColor:'white',borderWidth:2,borderColor:'black'
  }
});
//name
//des
//title
//appTitleText
//container
//this.state.light_theme ? styles.container2 : styles.container
