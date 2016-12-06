import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Dialog, DialogActions, DialogContent, Spinner} from 'react-mdl';
import {Link, hashHistory} from 'react-router';
import firebase from 'firebase';

class SignUpForm extends React.Component {
  constructor(props){
    super(props);
    this.state = { //track values and overall validity of each field
      email:{value:null,valid:false},
      name:{value:null,valid:false},
      password:{value:null,valid:false},
      passwordConf:{value:'',valid:false},
      showSpinner:false,
      errorMessage: ''
    };

    this.updateState = this.updateState.bind(this); //bind for scope
    this.handleSignUp = this.handleSignUp.bind(this);
    this.getRandomColor = this.getRandomColor.bind(this);
  }

  //callback for updating the state with child information
  updateState(stateChange){
    this.setState(stateChange);
  }

  // this function is copied from stackoverflow
  // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
  // since we are not using the photoURL field, just use it as
  // a color associated with this user
  getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  //callback for the submit button
  handleSignUp(event) {
    event.preventDefault();
    this.setState({showSpinner:true});

    /* Create a new user and save their information */
    firebase.auth().createUserWithEmailAndPassword(this.state.email.value, this.state.password.value)
      .then((firebaseUser) => {
        //include information (for app-level content)
        var color = this.getRandomColor();
        var profilePromise = firebaseUser.updateProfile({
          displayName: this.state.name.value,
          photoURL: color
        }); //return promise for chaining
        return profilePromise;
      })
      .catch((err) => {this.setState({errorMessage: err.message, showSpinner:false})})
      .then(() => {
        // redirect to the channel page
        hashHistory.push("/main");
      });
  }

  closeModal() {
    this.setState({errorMessage: '', showSpinner:false});
  }

  render() {
    //if all fields are valid, button should be enabled
    var buttonEnabled = (this.state.email.valid && this.state.name.valid && this.state.password.valid && this.state.passwordConf.valid);

    var spinnerSytle={'display':'none'};
    if (this.state.showSpinner) {
      spinnerSytle={};
    }

    return (
      <div>
        <form name="signupForm" >

          <EmailInput value={this.state.email.value} updateParent={this.updateState} />

          <RequiredInput
            id="name" field="name" type="text"
            label="Name" placeholder="your name"
            errorMessage="we need to know your name"
            value={this.state.name.value}
            updateParent={this.updateState} />

          <RequiredInput
            id="password" field="password" type="password"
            label="Password" placeholder=""
            errorMessage="your password can't be blank"
            value={this.state.password.value}
            updateParent={this.updateState} />

          <PasswordConfirmationInput value={this.state.passwordConf.value} password={this.state.password.value} updateParent={this.updateState}/>
          <div>
            <Button raised colored id="submitButton" type="submit" disabled={!buttonEnabled} onClick={this.handleSignUp}><Spinner style={spinnerSytle} />{' '}Sign Me Up!</Button>
          </div>
            <span>Aready have an account with us?</span>{' '} <Link to="/login">Sign In</Link>
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


/**
 * A component representing a controlled input for an email address
 */
class EmailInput extends React.Component {
  validate(currentValue){
    if (currentValue === null) {
      return {isValid:true};
    }

    if(currentValue === ''){ //check presence
      return {missing: true, isValid: false}
    }

    //check email validity
    //pattern comparison from w3c https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
    var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(currentValue)
    if(!valid){
      return {invalidEmail:true, isValid:false};
    }

    return {isValid: true}; //no errors
  }

  handleChange(event){
    //check validity (to inform parent)
    var isValid = this.validate(event.target.value).isValid;

    //what to assign to parent's state
    var stateUpdate = {
      'email': {
        value:event.target.value,
        valid:isValid
      }
    };

    this.props.updateParent(stateUpdate) //update parent state
  }

  render() {
    var errors = this.validate(this.props.value); //need to validate again, but at least isolated
    var inputStyle = 'form-group';
    if(!errors.isValid) inputStyle += ' invalid'; //add styling rule
    var value = this.props.value ? this.props.value : '';
    return (
      <div className={inputStyle}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" className="form-control" placeholder="email address"
                value={value}
                onChange={(e) => this.handleChange(e)}
        />
        {errors.missing &&
          <p className="help-block error-missing">we need to know your email address</p>
        }
        {!errors.missing && !errors.isValid &&
          <p className="help-block error-invalid">this is not a valid email address</p>
        }
      </div>
    );
  }
}


/**
 * A component representing a controlled input for a generic required field
 */
class RequiredInput extends React.Component {
  validate(currentValue){
    if (currentValue === null) {
      return {isValid:true};
    }

    if(currentValue === ''){ //check presence
      return {required: true, isValid: false};
    }
    return {isValid: true}; //no errors
  }

  handleChange(event){
    //check validity (to inform parent)
    var isValid = this.validate(event.target.value).isValid;

    //what to assign to parent's state
    var stateUpdate = {}
    stateUpdate[this.props.field] = {
      value:event.target.value,
      valid:isValid
    }

    this.props.updateParent(stateUpdate) //update parent state
  }

  render() {
    var errors = this.validate(this.props.value); //need to validate again, but at least isolated
    var inputStyle = 'form-group';
    if(!errors.isValid) inputStyle += ' invalid';

    var value = this.props.value ? this.props.value : '';
    return (
      <div className={inputStyle}>
        <label htmlFor={this.props.field}>{this.props.label}</label>
        <input type={this.props.type} id={this.props.id} name={this.props.field} className="form-control" placeholder={this.props.placeholder}
                value={value}
                onChange={(e) => this.handleChange(e)}
        />
        {!errors.isValid &&
          <p className="help-block error-missing">{this.props.errorMessage}</p>
        }
      </div>
    );
  }
}


/**
 * A component representing a controlled input for a password confirmation
 */
class PasswordConfirmationInput extends React.Component {
  validate(currentValue){
    if (this.props.password === '' || this.props.password === null) {
      return {isValid:true};
    }

    if (currentValue === this.props.password) {
      return {isValid:true};
    } else {
      return {mismatched:true, isValid:false}
    }
  }

  handleChange(event){
    //check validity (to inform parent)
    var isValid = this.validate(event.target.value).isValid;

    //what to assign to parent's state
    var stateUpdate = {
      // the state name is called passwordConf!!!
      'passwordConf': {
        value:event.target.value,
        valid:isValid
      }
    };

    this.props.updateParent(stateUpdate) //update parent state
  }

  render() {
    var errors = this.validate(this.props.value); //need to validate again, but at least isolated
    var inputStyle = 'form-group';
    if(!errors.isValid) inputStyle += ' invalid';

    var value = this.props.value ? this.props.value : '';
    return (
      <div className={inputStyle}>
        <label htmlFor="passwordConf">Confirm Password</label>
        <input type="password" id="passwordConf" name="passwordConf" className="form-control"
                value={value}
                onChange={(e) => this.handleChange(e)}
        />
        {errors.mismatched &&
          <p className="help-block error-mismatched">passwords don't match</p>
        }
      </div>
    );
  }
}

class SignUpPage extends React.Component {
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
            <div className="container" id="signUpContainer">
              <h1> Sign Up </h1>
              <SignUpForm />
            </div>
        );
    }
}

export default SignUpPage;
export {EmailInput, RequiredInput}