import React from 'react'
import PT from 'prop-types'
import { Text, View, StyleSheet, TextInput, Animated, Platform } from 'react-native'


const state = {
  toTop: 1,
  toBottom: 0,
}

export class FloatingInput extends React.Component {
  constructor(props) {
    super(props)

    this.labelAnimation = new Animated.Value(
      props.value.length > 0 ? 1 : 0
    )
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const hasValue = (nextProps.value !== this.props.value)
      && (nextProps.value.length > 0)

    if (!this.input.isFocused() && hasValue) {
      this.runAnimation(state.toTop)
    }
  }

  runAnimation = (state) => {
    Animated.timing(this.labelAnimation, {
      toValue: state,
      duration: this.props.duration,
    }).start()
  }

  onBlur = (e) => {
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }

    if (this.props.value.length > 0) {
      return
    }

    this.runAnimation(state.toBottom)
  }

  onFocus = (e) => {
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }

    if (this.props.value.length > 0) {
      return
    }

    this.runAnimation(state.toTop)
  }

  render() {
    const {
      value,
      label,
      settings,
      colorLabel,
      fontSize,
      labelStyle,
      inputStyle,
      containerStyle,
    } = this.props

    return (
        <View
          style={[
            styles.container,
            containerStyle && containerStyle,
          ]}
        >
          <Animated.Text
            style={[
              {
                transform: [{
                  translateY: this.labelAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [settings.translateY, 0],
                  })
                }],
                fontSize: this.labelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [fontSize.from, fontSize.to],
                }),
                color: this.labelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colorLabel.from, colorLabel.to],
                }),
              },
              styles.label,
              labelStyle && labelStyle,
            ]}
          >
            {label}
          </Animated.Text>
          <TextInput
            ref={(c) => this.input = c}
            value={value}
            underlineColorAndroid="transparent"
            style={[
              styles.input,
              inputStyle && inputStyle,
            ]}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </View>
    )
  }
}

FloatingInput.propTypes = {
  duration: PT.number,
  value: PT.string,
  label: PT.string,
  settings: PT.shape({
    translateY: PT.number,
  }),
  colorLabel: PT.shape({
    from: PT.number,
    to: PT.number,
  }),
  fontSize: PT.shape({
    from: PT.number,
    to: PT.number,
  }),
}

FloatingInput.defaultProps = {
  duration: 150,
  value: '',
  label: 'label default',
  settings: Platform.select({
    ios: {
      translateY: 25,
    },
    android: {
      translateY: 25,
    },
  }),
  colorLabel: { from: '#65444444', to: '#65444444' },
  fontSize: { from: 14, to: 12 },
}

const styles = StyleSheet.create({
  input: {
    color: '#272b37',
    fontSize: 14,
    lineHeight: 24,
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#19444444',
    flex: 1,
  },
  label: {
    textAlign: 'left',
  },
  container: {
    position: 'relative',
    minHeight: 50,
    justifyContent: 'flex-end',
    width: '100%'
  },
})
