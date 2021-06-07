import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, ListItem } from "react-native-elements"
import Stylesheet from './Stylesheet';

export default class ListHold extends Component {

  // establishes the title for the window
  static navigationOptions = { title: 'My Holds' };

  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }

  // handles the mount information, setting session variables, etc
  componentDidMount = async() =>{
    // store the values into the state
    this.setState({
      password: await AsyncStorage.getItem('password'),
      pathLibrary: await AsyncStorage.getItem('library'),
      pathUrl: await AsyncStorage.getItem('url'),
      patronName: await AsyncStorage.getItem('patronName'),
      username: await AsyncStorage.getItem('username')
    });

    // grab the checkouts
    this.getCheckOuts();

    // forces a new connection to ensure that we're getting the newest stuff
    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => { this.getCheckOuts(); } );
  }

  // needed to ensure that the data refreshes
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  // grabs the items checked out to the account
  getCheckOuts = () => {
    const random = new Date().getTime();
    const navPath = this.props.navigation.state.params.item;
    const url = this.state.pathUrl + '/app/aspenListHolds.php?library=' + this.state.pathLibrary + '&barcode=' + this.state.username + '&pin=' + this.state.password + '&action=ilsCKO&rand=' + random;
    
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.Items,
          isLoading: false,
        });
      })
      .catch(error => {
        console.log("get data error from:" + url + " error:" + error);
      });
  };

  // renders the items on the screen
  renderNativeItem = (item) => {
    var position = item.position;
    var subtitle = 'By: ' + item.author + '\nYour position in queue: ' + item.position;
    if (position.length > 5) { subtitle = 'By: ' + item.author + '\n' + item.position; }
    if (item.holdSource != 'ILS') { subtitle += ' (' + item.holdSource + ')'; }
     
    return (
      <ListItem bottomDivider onPress={ () => this.onPressItem(item) }>
        <Avatar rounded source={{ uri: item.thumbnail }} />
        <ListItem.Content>
          <ListItem.Title>{ item.key }</ListItem.Title>
          <ListItem.Subtitle>{ subtitle }</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  }

  // remains for future hold manipulation (suspend, unsuspend, etc)
  onPressItem = (item) => {
    Alert.alert("Coming Soon", "We are constantly trying to improve the App. Manipulating holds is not yet available. We hope to include this in an upcoming version.", [ { text: "Close" } ]);
  }

  _listEmptyComponent = () => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>You've got no items on hold ... let's do something about that!</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  getHeader = () => {
    return (
      <View>
        <View style={ Stylesheet.accountInformation }>
            <Text style={ Stylesheet.accountTextHeader }>Items Currently On Hold:</Text>
        </View>
      </View>
    );
  }
  
  render() {
    if (this.state.isLoading) {
      return (
        <View style={ Stylesheet.activityIndicator }>
          <ActivityIndicator size='large' color='#272362' />
        </View>
      );
    }

    return (
      <View style={ Stylesheet.searchResultsContainer }>
        <FlatList
          data={ this.state.data } 
          ListEmptyComponent = { this._listEmptyComponent() }
          renderItem={( {item} ) => this.renderNativeItem(item) }  
          ListHeaderComponent={ this.getHeader() }
        />
      </View>
    );
  }
}