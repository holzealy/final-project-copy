import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.css';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import SignInPage from './SignInPage.js';
import SignUpPage from './SignUpPage.js';
import MainPage from './MainPage.js';
import DiscussionsPage from './DiscussionsPage.js';
import DiscussionDetailsPage from './DiscussionDetailsPage.js';
import EventsPage from './EventsPage.js';
import EventDetailsPage from './EventDetailsPage.js';
import About from './About.js';
import News from './News.js'
import Resources from './Resources.js'

// firebase config
var config = {
  apiKey: "AIzaSyCGjkvp_HOL_3SXeLtsGDvq0i3FowxKEmE",
  authDomain: "final-project-copy.firebaseapp.com",
  databaseURL: "https://final-project-copy.firebaseio.com",
  storageBucket: "final-project-copy.appspot.com",
  messagingSenderId: "349526243937"
};
firebase.initializeApp(config);

//render react routing in DOM
ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={MainPage} />
      <Route path="join" component={SignUpPage} />
      <Route path="login" component={SignInPage} />
      <Route path="main" component={MainPage} />
      <Route path="discussions" component={DiscussionsPage} />
      <Route path="discussion/:discussionId" component={DiscussionDetailsPage} />
      <Route path="events" component={EventsPage} />
      <Route path="event/:eventId" component={EventDetailsPage} />
      <Route path="about" component={About}/>
      <Route path="news" component={News}/>
      <Route path="resources" component={Resources}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
