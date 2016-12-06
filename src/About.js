import React from 'react';
import {Link} from 'react-router';
import alyssa from './img/alyssa.jpg';
import bruce from './img/bruce.jpg';
import amy from './img/amy.jpg';
import 'bootstrap/dist/css/bootstrap.css';

class About extends React.Component {
  render() {
    return (
      <div id="about-container" className="container">
        <h1> About </h1>
        <div>
          <p>A serious concern for immigrants in the United States post Donald Trump’s presidential election is how their “status”
          will be affected. Particularly for students, many are concerned and want to know how his proposed policies and the
          socio-political climate produced by his win will affect their education and safety. </p>
          <p>This website was designed with international students in mind, primarily to aid them in understanding how the election
          will affect them and provides resources and answers to their questions.
          Users can communicate via a discussion board, upload and view events within international communities, and track legislation
          that will directly affect their lives & education in the United States. </p>
          <p>This site should be able to answer
          questions that the campaign has stirred up and help provide stability during a time of such uncertainty for international
          students and persons at the University of Washington.
          </p>
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
              to use his web development skill to help those who might be affected by Trump’s presidential election.</p>
            </div>
          </div>
          <div className="creator col-xs-12 col-md-4">
            <img className="creator-img" src={amy} alt="Amy"/>
            <div className="creator-text">
              <h3>Amy</h3><p>is a junior at the University of Washington majoring in Informatics. She is from Potomac, Maryland.</p>
            </div>
          </div>
        </div>
        <div><Link to="/main">Go back to main page</Link></div>
      </div>
    )
  }
}

export default About;
