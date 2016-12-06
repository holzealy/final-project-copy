import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import homebanner from './img/homebanner.jpg';
import Time from 'react-time';

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {'discussions': null};
    }
    componentDidMount() {
        /* Add a listener and callback for authentication events */
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('Auth state changed: logged in as', user.email);
            }
            else {
                console.log('Auth state changed: logged out');
            }
        });

        this.discussionRef = firebase.database().ref('discussions');
        this.discussionRef.on('value', (snapshot)=>{
            var discussionsArray = [];
            snapshot.forEach((child) => {
                var obj = {'key': child.key, 'value': child.val()};
                discussionsArray.push(obj);
            });
            this.setState({'discussions': discussionsArray});
        });
    }

    componentWillUnmount() {
        if (this.discussionRef) {
            this.discussionRef.off();
        }
        if (this.unregister) {
            this.unregister();
        }
    }

    render() {
        var discussionContent = undefined;
        if (this.state.discussions) {
            var discussions = this.state.discussions.map((discussion) => {
                return (<DiscussionItem key={discussion.key} discussion={discussion.value}/>);
            });
            discussionContent = (<div className="main-page-discussion">
                                    <h1>Popular discussions:</h1>
                                    <ul>
                                        {discussions}
                                    </ul>
                                </div>);
        } else {
            discussionContent = (<div className="main-page-discussion">There are no discussions currently. Create your first one!</div>)
        }

        return (
            <div className="container" id="home-content">
                <div className="row">
                    <div className="col-xs-12">
                        <img className="banner" src={homebanner} role="presentation" />
                    </div>
                    <div className="col-xs-12">
                        <h2>About Us</h2>
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

                    <div className="col-xs-12 col-md-4 main-page-card">
                        <Link to="/discussions" className="list-group-item">
                            <div className="page-desc-heading">
                                <i className="material-icons">question_answer</i>
                                <h2>Discussions</h2>
                            </div>
                            <p>Start or join a discussion with other students.</p>
                            {discussionContent}
                        </Link>
                    </div>

                    <div className="col-xs-12 col-md-4 main-page-card">
                        <Link to="/news" className="list-group-item">
                            <div className="page-desc-heading">
                                <i className="material-icons">picture_in_picture</i>
                                <h2>News</h2>
                            </div>
                            <p>Access a live feed of recent news stories relating to immigration legislation and read full articles by following the links provided.
                            Learn about policies or legislation that may directly impact you as a student so you can make a plan for your education.</p>
                        </Link>
                    </div>

                    <div className="col-xs-12 col-md-4 main-page-card">
                        <Link to="/events" className="list-group-item">
                            <div className="page-desc-heading">
                                <i className="material-icons">event</i>
                                <h2>Events</h2>
                            </div>
                            <p>Learn about events that are happening on campus and in the area for international students and allies who are also concerned about the state of the country so you can become a part of a supportive community. If you know about an event that is happening, feel free to post it here for others to see.</p>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

class DiscussionItem extends React.Component {
    render() {
        return (
            <li>
                <div className="main-page-discussion-title">{this.props.discussion.title}
                </div>
                <div className="main-page-post-time">posted{' '}<Time value={this.props.discussion.createTime} relative/>
                </div>
            </li>
        );
    }
}

export default MainPage;