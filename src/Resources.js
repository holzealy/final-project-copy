import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

//content for the resources page containing different resources
class Resources extends React.Component {
  render() {
    return (
      <div>
      <div className="header-cont">
        <header className="main-header resources-header">
        <div className="header-text">
        <h1 className="header-title">Resources</h1>
        <p className="header-desc">Where to go now</p>
        </div>
        </header>
        </div>
      <div className="container">
        <ul id="resources-list">
        <li><a href="https://iss.washington.edu/">UW International Student Services (ISS)</a></li>
        <p>Learn more about the UW ISS, a team of advisors that provide knowledgeable and empathetic advice to F-1 and J-1 students.</p>
        <li><a href="https://uws-community.symplicity.com/?s=student_group">UW Registered Student Organizations (RSOs)</a></li>
        <p>Go to UW? Find some RSOs that have to do with a community you are a part of or want to join.</p>
        <li><a href="http://www.seattle.gov/">Seattle Government</a></li>
        <p>Learn more about how the Seattle government works and how to make oyur voice heard.</p>
        <li><a href="http://www.house.gov/representatives/find/">Find your local representative</a></li>
        <p>Not from Seattle? Find out who to contact about legilation and events that happen in your area.</p>
        </ul>
      </div>
      </div>
    )
  }
}

export default Resources;
