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
import FlatButton from 'material-ui/FlatButton';
//get necessary elements for material-ui
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

//main framework for the whole site
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  //handle the opening of the nav menu drawer
  handleToggle() {
    this.setState({open: !this.state.open});
  }
  //handle the closing of the nav menu drawer
  handleClose() {
    this.setState({open: false});
  }
  //handle signing out
  handleSignOut() {
    this.setState({open: false});
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    hashHistory.push("/login");
  }
  //contains the app bar, navigation drawer
  render() {
    return (
     <div>
       <MuiThemeProvider>
        <AppBar
          title="INTL"
          iconElementLeft={<IconButton><MenuIcon /></IconButton>}
          onLeftIconButtonTouchTap={this.handleToggle}
          style={{backgroundColor: '#90A4AE',}}>
          <div id="topNav">
            <Link to="/main"><FlatButton style={{color: 'white'}} onTouchTap={this.handleClose} >Homepage</FlatButton></Link>
            <Link to="/about"><FlatButton style={{color: 'white'}} onTouchTap={this.handleClose} >About</FlatButton></Link>
            <Link to="/resources"><FlatButton style={{color: 'white'}} onTouchTap={this.handleClose} >Resources</FlatButton></Link>
            <Link to="/news"><FlatButton style={{color: 'white'}} onTouchTap={this.handleClose} >News</FlatButton></Link>
            <Link to="/discussions"><FlatButton style={{color: 'white'}} onTouchTap={this.handleClose} >Discussions</FlatButton></Link>
            <Link to="/events"><FlatButton style={{color: 'white'}} onTouchTap={this.handleClose} >Events</FlatButton></Link>
            <SignInOrOutTop handleClose={this.handleClose} handleSignOut={this.handleSignOut}/>
          </div>
          <DrawerMenu
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => {this.setState({open})} } >
            <h3 className="nav-label">INTL</h3>
            <Link to="/main"><MenuItem onTouchTap={this.handleClose} >Homepage</MenuItem></Link>
            <Link to="/about"><MenuItem onTouchTap={this.handleClose} >About</MenuItem></Link>
            <Link to="/resources"><MenuItem onTouchTap={this.handleClose} >Resources</MenuItem></Link>
            <Link to="/news"><MenuItem onTouchTap={this.handleClose} >News</MenuItem></Link>
            <h4 className="nav-label">Member content</h4>
            <Link to="/discussions"><MenuItem onTouchTap={this.handleClose} >Discussions</MenuItem></Link>
            <Link to="/events"><MenuItem onTouchTap={this.handleClose} >Events</MenuItem></Link>
            <br/>
            <SignInOrOut handleClose={this.handleClose} handleSignOut={this.handleSignOut}/>
          </DrawerMenu>
        </AppBar>
      </MuiThemeProvider>

        {this.props.children}

    </div>
    );
  }
}

//if the user is signed in, only show the sign out button and show "user signed in as"
//if the user is signed out, only show the sign in option
class SignInOrOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {link: '', touchTap: null, text: '', signedIn: '', signedInAs:''}
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        console.log('should be able to log out');
        this.setState({link: '/main', touchTap: this.props.handleSignOut, text: 'Sign Out'})
        this.setState({signedIn: user.email, signedInAs: 'Signed in as: '})
      }
      else{
        console.log('should be able to log in');
        this.setState({link: '/login', touchTap: this.props.handleClose, text: 'Sign In'})
        this.setState({signedIn: '', signedInAs: ''})
      }
    })
  }
  render() {
    return (
      <div>
      <p>{this.state.signedInAs}{this.state.signedIn}</p>
      <Link to={this.state.link}><MenuItem onTouchTap={this.state.touchTap}><ArrowIcon />{' '}{this.state.text}</MenuItem></Link>
      </div>
    );
  }
}

//show sign in or sign out in app bar based on auth state
class SignInOrOutTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {link: '', touchTap: null, text: ''}
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        console.log('should be able to log out');
        this.setState({link: '/main', touchTap: this.props.handleSignOut, text: 'Sign Out'})

      }
      else{
        console.log('should be able to log in');
        this.setState({link: '/login', touchTap: this.props.handleClose, text: 'Sign In'})
      }
    })
  }
  render() {
    return (
      <Link to={this.state.link}><FlatButton style={{color: 'white'}} onTouchTap={this.state.touchTap}><ArrowIcon style={{color: 'white'}} />{' '}{this.state.text}</FlatButton></Link>
    );
  }
}


export default App;
