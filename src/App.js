import React, { Component } from 'react';
import {Link, hashHistory} from 'react-router';
import './App.css';
import firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import DrawerMenu from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import ArrowIcon from 'material-ui/svg-icons/navigation/arrow-back';




import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  handleClose() {
    this.setState({open: false});
  }

  handleSignOut() {
    this.setState({open: false});
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    hashHistory.push("/login");
  }

  render() {
    return (
     <div>
       <MuiThemeProvider>
        <AppBar
          title="Title"
          iconElementLeft={<IconButton><MenuIcon /></IconButton>}
          onLeftIconButtonTouchTap={this.handleToggle} >
          <DrawerMenu
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => {this.setState({open})} } >
            <MenuItem onTouchTap={this.handleClose} ><Link to="/main">Homepage</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose} ><Link to="/about">About</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose} ><Link to="/news">News</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose} ><Link to="/discussions">Discussions</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose} ><Link to="/events">Events</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose} ><Link to="/login">Sign In</Link></MenuItem>
            <MenuItem onTouchTap={this.handleSignOut}><ArrowIcon />{' '}Sign out</MenuItem>
          </DrawerMenu>
        </AppBar>
      </MuiThemeProvider>
      <div className="container">
        {this.props.children}
      </div>
    </div>
    );
  }
}
export default App;
