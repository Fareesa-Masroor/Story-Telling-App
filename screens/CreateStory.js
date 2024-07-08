import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { collection } from 'firebase/firestore';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import db from '../config';
import firebase from 'firebase';

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: 'image_1',
      dropdownHeight: 40,
      setImage: '',
      title: '',
      moral: '',
      story: '',
      description: '',
      light_theme: '',
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ setImage: result.uri });
    }
  };
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
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
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
                New Story
              </Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <View style={{}}></View>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => {
                  this.pickImage();
                }}>
                <Text
                  style={this.state.light_theme ? styles.text4 : styles.text3}>
                  Add Image+
                </Text>
                <Image
                  source={{ uri: this.state.setImage }}
                  style={styles.previewImage}></Image>
              </TouchableOpacity>
              <TextInput
                style={
                  this.state.light_theme ? styles.inputFont2 : styles.inputFont
                }
                onChangeText={(title) => this.setState({ title })}
                placeholder={'Title'}
                placeholderTextColor={
                  this.state.light_theme ? 'black' : 'white'
                }
              />

              <TextInput
                style={
                  this.state.light_theme ? styles.inputFont2 : styles.inputFont
                }
                onChangeText={(description) => this.setState({ description })}
                placeholder={'Description'}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={
                  this.state.light_theme ? 'black' : 'white'
                }
              />
              <TextInput
                style={
                  this.state.light_theme ? styles.inputFont2 : styles.inputFont
                }
                onChangeText={(story) => this.setState({ story })}
                placeholder={'Story'}
                multiline={true}
                numberOfLines={20}
                placeholderTextColor={
                  this.state.light_theme ? 'black' : 'white'
                }
              />

              <TextInput
                style={
                  this.state.light_theme ? styles.inputFont2 : styles.inputFont
                }
                onChangeText={(moral) => this.setState({ moral })}
                placeholder={'Moral of the story'}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={
                  this.state.light_theme ? 'black' : 'white'
                }
              />
              <TouchableOpacity
                style={this.state.light_theme ? styles.Button2 : styles.Button1}
                onPress={() => {
                  if (
                    this.state.title ||
                    this.state.moral ||
                    this.state.story ||
                    this.state.description
                  ) {
                    const num = Math.floor(Math.random() * 100);
                    db.collection('Data').add({
                      title: this.state.title,
                      moral: this.state.moral,
                      description: this.state.description,
                      story: this.state.story,
                      image: this.state.setImage,
                      name: firebase.auth().currentUser.displayName,
                      like: 0,
                    });
                    this.props.navigation.navigate('Feed');
                  } else {
                    alert('All Fields are required');
                  }
                }}>
                <Text
                  style={this.state.light_theme ? styles.text2 : styles.text}>
                  {' '}
                  Add Story
                </Text>
              </TouchableOpacity>
            </ScrollView>
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
  container2: {
    flex: 1,
    backgroundColor: 'white',
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
  appTitleText2: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: '93%',
    height: RFValue(230),
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: 'contain',
  },
  inputFont: {
    height: RFValue(40),
    borderColor: 'white',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'white',
    fontFamily: 'Bubblegum-Sans',
    marginTop: RFValue(15),
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
  inputFont2: {
    height: RFValue(40),
    borderColor: 'black',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'black',
    fontFamily: 'Bubblegum-Sans',
    marginTop: RFValue(15),
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
  Button1: {
    width: '60%',
    height: 50,
    borderRadius: 30,
    backgroundColor: 'black',
    marginBottom: 10,
    margin: 5,
    alignSelf: 'center',
    top: 10,
  },
  Button2: {
    width: '60%',
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    marginBottom: 10,
    margin: 5,
    alignSelf: 'center',
    top: 10,
    borderColor: 'black',
  },
  text: {
    textAlign: 'center',
    margin: 8,
    color: 'white',
    fontSize: 18,
    fontFamily: 'Bubblegum-Sans',
  },
  text2: {
    textAlign: 'center',
    margin: 8,
    color: 'black',
    fontSize: 18,
    fontFamily: 'Bubblegum-Sans',
  },
  text4: {
    top: 120,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Bubblegum-Sans',
  },
  text3: {
    top: 120,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Bubblegum-Sans',
  },
});
