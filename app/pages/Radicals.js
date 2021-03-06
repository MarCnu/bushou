import React, { Component } from 'react';
import { 
  Platform, 
  StyleSheet, 
  Text, 
  View,
  Dimensions,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';

import Settings from '../classes/Settings';
import DarkMode from '../components/DarkMode'
import Language from '../components/Language'

// Static data
import { LEVELS } from '../data/levels'
import { __ } from '../data/text'

// Dependencies
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

export default class Radicals extends Component {

  /**
   * Navigation options (hide the top bar)
   */
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      'progress': 0,
      'popup': false
    }

    // Need a function for support settings
    this.styles = getStyles()
    
    this.getProgress = this.getProgress.bind(this)
    this.reloadStyle = this.reloadStyle.bind(this)
    this.setLanguage = this.setLanguage.bind(this)

  }

  componentDidMount() { 
    this.getProgress()
    this.props.navigation.addListener('didFocus', () => {
      this.getProgress()
      this.reloadStyle()
    })
  }

  reloadStyle = () => {
    // Change theme when reload
    this.styles = getStyles()
    this.getProgress()
  }

  getProgress = async () => {
    AsyncStorage.getItem('progress').then(async (value) => {
      const progress = value ? value : 1
      this.setState({progress: progress})
    })
  }

  setLanguage(value) {
    Settings.setSetting('language', value, () => {
      this.setState({
        popup: false,
        progress:0
      })
      this.reloadStyle()
    })
  }

  /**
   * Renders the page
   */
  render() {

    // Show the progress only when we load the progress number
    let levels = null
    if(this.state.progress !== 0) {
      levels =
      <Carousel
        layout='default'
        ref={(c) => { this._carousel = c; }}
        data={LEVELS}
        renderItem={this._renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth/1.33}
        firstItem={this.state.progress - 1}
      />
    }

    let popup = null
    if(this.state.popup !== false) {
      popup = 
        <View style={this.styles.popupBg}>
          <View style={this.styles.popup}>
            <TouchableOpacity onPress={() => this.setLanguage('en')}>
              <Text style={this.styles.popupText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setLanguage('fr')}>
              <Text style={this.styles.popupText}>Français</Text>
            </TouchableOpacity>
            <Text 
              onPress={() => this.setState({'popup': false})}
              style={[
                this.styles.instructions, 
                { 
                  marginTop: 20, 
                  borderColor: Settings.data.colors.primary, 
                  color: Settings.data.colors.primary}
              ]}>
             { __('close') }
            </Text>
          </View>
        </View>
    }

    return (
      <View style={this.styles.container}>
        { popup }
        <View style={this.styles.header}>
          <DarkMode handler={() => {
            this.setState({'progress':0})
            this.reloadStyle()
          }}/>
          <Language handler={() => {
            this.setState({'popup': true})
            this.reloadStyle()
          }}/>
        </View>
        <Text style={this.styles.welcome}>
          部首
        </Text>
        <Text style={this.styles.welcome}>
          { __('radicals') }
        </Text>
        <View style={this.styles.carousel}>
          { levels }
        </View>
      </View>
    );
  }

  _renderItem = ({item, index}) =>  {
    
    const {navigate} = this.props.navigation;
    const isLocked = this.state.progress <= parseInt(index)
    let textStyle = isLocked ? Settings.data.colors.background : Settings.data.colors.primary 

    return(
      <View style={!isLocked ? this.styles.carouselItem : this.styles.carouselItemLocked}>
        <Text style={[this.styles.carouselTitle, {color: textStyle}]}>
          {item.title}
        </Text>
        <Text style={[{color: textStyle}]}>
          { __('characters_number') }: {item.characters}
        </Text>
        <Text 
          style={[this.styles.instructions, {color: textStyle}]} onPress={() => !isLocked ? navigate('Characters', {
            title: item.title,
            levelNumber: parseInt(index) + 1,
            charactersNumber: parseInt(item.characters),
            redirectPage: 'Radicals',
            progressKey: 'progress',
            file: 'radicals',
            type: 'characters'
        }) : ''}>
          {!isLocked ? __('start') : __('locked')}
        </Text>
      </View>
    );
  }
}

const getStyles = () => (StyleSheet.create({
  popupBg: {
    zIndex: 9999,
    width: '100%',
    height: '100%',
    opacity: 0.9,
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Settings.data.colors.primary,
    color: Settings.data.colors.background,
  },
  popupText: {
    color: Settings.data.colors.primary,
    paddingTop: 10,
    paddingBottom: 10,
  },
  popup: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    opacity: 1,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '20%',
    width: '80%',
    marginLeft: '10%',
    backgroundColor: Settings.data.colors.background,
    color: Settings.data.colors.primary,
  },
  popupCross: {
    position: 'absolute',
    right: '5%',
    top: '5%',
    paddingTop: '5%'
  },
  container: {
    position: 'relative',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Settings.data.colors.background,
    color: Settings.data.colors.primary,
  },
  header: {
    flex: 1,
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
    position: 'absolute',
    top: 10,
    left: 0,
    height: 80,
    paddingLeft: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: Settings.data.colors.primary,
  },
  instructions: {
    textAlign: 'center',
    color: Settings.data.colors.primary,
    marginBottom: 5,
    padding: 10,
    borderColor: Settings.data.colors.primary,
    color: Settings.data.colors.primary,
    borderWidth: 1,
    width: '66%'
  },
  carousel: {
    width: '100%',
    height: '30%',
    marginTop: '5%'
  },
  carouselItem: {
    height: '100%',
    borderWidth: 1,
    borderColor: Settings.data.colors.primary,
    color: Settings.data.colors.primary,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  carouselItemLocked: {
    height: '100%',
    borderWidth: 1,
    borderColor: Settings.data.colors.background,
    color: Settings.data.colors.background,
    backgroundColor: Settings.data.colors.primary,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  carouselTitle: {
    fontSize: 20,
  }
}))
