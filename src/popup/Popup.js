import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Donate from './components/Donate'
import Footer from './components/Footer'
import parseUrl from '../utils/parseUrl'
import defaults from '../defaults'

export default class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enabled: props.enabled,
      statistics: props.statistics,
      disabledHosts: props.disabledHosts,
      convertBw: props.convertBw,
      compressionLevel: props.compressionLevel,
      proxyUrl: props.proxyUrl
    }

    chrome.runtime.onMessage.addListener(this.stateWasUpdatedFromBackground)
  }

  enableSwitchWasChanged = () => {
    this.setState(prevState => ({ enabled: !prevState.enabled }), this.stateWasUpdatedFromUI)
  }

  siteWasDisabled = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(
      prevState => ({
        disabledHosts: prevState.disabledHosts.concat(hostname)
      }),
      this.stateWasUpdatedFromUI
    )
  }

  siteWasEnabled = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(
      prevState => ({
        disabledHosts: prevState.disabledHosts.filter(site => site !== hostname)
      }),
      this.stateWasUpdatedFromUI
    )
  }

  disabledHostsWasChanged = (_, { value }) => {
    this.setState(prevState => ({ disabledHosts: value.split('\n') }), this.stateWasUpdatedFromUI)
  }

  convertBwWasChanged = () => {
    this.setState(prevState => ({ convertBw: !prevState.convertBw }), this.stateWasUpdatedFromUI)
  }

  compressionLevelWasChanged = (_, { value }) => {
    this.setState(prevState => ({ compressionLevel: value }), this.stateWasUpdatedFromUI)
  }

  proxyUrlWasChanged = (_, { value }) => {
    this.setState(prevState => ({ proxyUrl: value }), this.stateWasUpdatedFromUI)
  }

  proxyUrlWasReset = () => {
    this.setState(prevState => ({ proxyUrl: defaults.proxyUrl }), this.stateWasUpdatedFromUI)
  }

  /**
   * Sync every UI state change with local storage and background process.
   */
  stateWasUpdatedFromUI = () => {
    chrome.storage.local.set(this.state)
    chrome.runtime.sendMessage(this.state)
  }

  /**
   * Receive state changes from background process and update UI.
   */
  stateWasUpdatedFromBackground = newState => {
    this.setState(newState)
  }

  render() {
    return (
      <Router>
        <div>
          <Header enabled={this.state.enabled} onChange={this.enableSwitchWasChanged} />
          <Route
            exact
            path="/"
            render={() => (
              <Home
                {...this.state}
                currentUrl={this.props.currentUrl}
                onSiteDisable={this.siteWasDisabled}
                onSiteEnable={this.siteWasEnabled}
                disabledOnChange={this.disabledHostsWasChanged}
                convertBwOnChange={this.convertBwWasChanged}
                compressionLevelOnChange={this.compressionLevelWasChanged}
                proxyUrlOnChange={this.proxyUrlWasChanged}
                proxyUrlOnReset={this.proxyUrlWasReset}
              />
            )}
          />
          <Route path="/donate" render={() => <Donate />} />
          <Footer />
        </div>
      </Router>
    )
  }
}
