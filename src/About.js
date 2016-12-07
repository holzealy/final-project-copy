import React from 'react';
import alyssa from './img/alyssa.jpg';
import bruce from './img/bruce.jpg';
import amy from './img/amy.jpg';
import 'bootstrap/dist/css/bootstrap.css';

//content for the about page
class About extends React.Component {
  render() {
    return (
      <div>
      <div className="header-cont">
        <header className="main-header about-header">
        <div className="header-text">
        <h1 className="header-title">About</h1>
        <p className="header-desc">What INTL is and who we are</p>
        </div>
        </header>
        </div>
      <div className="container">
        <div>
        <br/>
          <p>The current political and social climate in the United States of America has been pretty unstable as of late. It is not a particularly comfortable subject to talk about, especially for international students.
          We wanted to make a resource that provides students with the necessary community and tools to let them stay as educated and up-to-date as possible. </p>
          <p>This website is geared towards international studnets in Seattle. We are three students from the University of Washington in Seattle and we hope that this website can help unite and create a community in our area.</p>
          <h3>What can you do with INTL?</h3>
          <p>
          Users can communicate via a discussion board, upload and view events within international communities, and track important news
          that could directly affect their lives and education in the United States. </p>
          <p>We want this site to be the launching point for students to be informed - talk to other students about different ideas and issues you have with current events and legislation, find helpful resources that you can go to for support and community, read some news articles and dive deeper in these stories.</p>
        </div>
        <div className="row">
          <h2 id="about-h2"> Created by </h2>
          <div className="creator col-xs-12 col-md-4">
            <img className="creator-img" src={alyssa} alt="Alyssa"/>
            <div className="creator-text">
              <h3>Alyssa</h3><p>is a junior at the University of Washington majoring in Informatics. She is from Bainbridge Island, WA.</p>
            </div>
          </div>
          <div className="creator col-xs-12 col-md-4">
            <img className="creator-img" src={bruce} alt="Bruce"/>
            <div className="creator-text">
              <h3>Bruce</h3>
              <p>is a senior at the University of Washington majoring in Computer Science. He is interested in web development and wants
              to use his web development skills to create services that can help others.</p>
            </div>
          </div>
          <div className="creator col-xs-12 col-md-4">
            <img className="creator-img" src={amy} alt="Amy"/>
            <div className="creator-text">
              <h3>Amy</h3><p>is a junior at the University of Washington majoring in Informatics, hoping to go into the field of software engineering. She is from Potomac, Maryland.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

export default About;
