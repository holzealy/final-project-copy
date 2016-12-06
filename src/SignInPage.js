import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Spinner, Dialog, DialogContent, DialogActions} from 'react-mdl';
import {Link, hashHistory} from 'react-router';
import {EmailInput, RequiredInput} from './SignUpPage.js';
import firebase from 'firebase';

class SignInForm extends React.Component {
  constructor(props){
    super(props);
    this.state = { //track values and overall validity of each field
      email:{value:null,valid:false},
      password:{value:null,valid:false},
      howSpinner:false,
      errorMessage: ''
    };

    this.updateState = this.updateState.bind(this); //bind for scope
    this.handleSignIn = this.handleSignIn.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  //callback for updating the state with child information
  updateState(stateChange){
    this.setState(stateChange);
  }

  //callback for the submit button
  handleSignIn(event) {
    event.preventDefault();

    this.setState({showSpinner:true});
    /* Sign in the user */
    firebase.auth().signInWithEmailAndPassword(this.state.email.value, this.state.password.value)
    .then(() => {
      // redirect user to the channel page
      this.setState({showSpinner:false});
      hashHistory.push("/main");
    })
    .catch((err) => {
      console.log("error!");
      this.setState({errorMessage: err.message, showSpinner:false});
    });
  }

  closeModal() {
    this.setState({errorMessage: '', showSpinner:false});
  }

  render() {
    //if all fields are valid, button should be enabled
    var buttonEnabled = (this.state.email.valid && this.state.password.valid);

    var spinnerSytle={'display':'none'};
    if (this.state.showSpinner) {
      spinnerSytle={};
    }
    return (
      <div>
        <form name="signInForm" >

          <EmailInput value={this.state.email.value} updateParent={this.updateState} />

          <RequiredInput
            id="password" field="password" type="password"
            label="Password" placeholder="password"
            errorMessage="your password can't be blank"
            value={this.state.password.value}
            updateParent={this.updateState} />

          <div>
            <Button raised colored id="submitButton" type="submit" disabled={!buttonEnabled} onClick={this.handleSignIn}><Spinner style={spinnerSytle}/>{' '}Sign In</Button>
          </div>
            <span>Don't have an accout yet?</span>{' '} <Link to="/join">Sign Up</Link>
          <div>
          </div>
        </form>
        <Dialog open={this.state.errorMessage !== ''} >
            <DialogContent>
              {this.state.errorMessage}
            </DialogContent>
            <DialogActions>
                <Button type='button' onClick={this.closeModal} colored raised>close</Button>
            </DialogActions>
        </Dialog>
      </div>
    );
  }
}


class SignInPage extends React.Component {

  componentDidMount() {
        /* Add a listener and callback for authentication events */
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                console.log('Auth state changed: logged in as', user.email);
                hashHistory.push("/main");
            }
            else{
                console.log('Auth state changed: logged out');
            }
        });
    }

    componentWillUnmount() {
        if(this.unregister) {
            this.unregister();
        }
    }

    render() {
        return (
            <div className="container" id="signInContainer">
              <h1> Sign In </h1>
              <SignInForm />
            </div>
        );
    }
}

export default SignInPage;
