import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import Time from 'react-time';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {'discussions': null};
    }
    //controls for when the user is signed in or out, gets the discussions for the discussion preview
    componentDidMount() {
        // Add a listener and callback for authentication events
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
            //updates discussion list
            discussionsArray.sort((a, b) => {
                return b.value.createTime - a.value.createTime;
            });
            var sliced = discussionsArray.slice(0, 2);
            this.setState({'discussions': sliced});
        });
    }

    //if the user is signed in, they can see the discussions, if they aren't they can't click through
    componentWillUnmount() {
        //unregister listeners
        if (this.discussionRef) {
            this.discussionRef.off();
        }
        if (this.unregister) {
            this.unregister();
        }
    }

    //render the main page: header, about preview, feature (discussion, news, events) preview cards
    render() {
        var discussionContent = undefined;
        if (this.state.discussions) {
            //gives preview of recent discussions
            var discussions = this.state.discussions.map((discussion) => {
                return (<DiscussionItem key={discussion.key} discussion={discussion.value}/>);
            });
            discussionContent = (<div className="main-page-discussion">
                                    <h1>Popular discussions:</h1>
                                    <ul>
                                        {discussions}
                                    </ul>
                                </div>);
        } else { //if the discussion board is empty
            discussionContent = (<div className="main-page-discussion">There are no discussions currently. Create your first one!</div>)
        }

        return (
                <div>
                  <div className="header-cont">
                    <header className="main-header">

                    <div className="header-text">
                    <h1 className="header-title">INTL</h1>
                    <p className="header-desc">A hub for international students</p>
                    <ul>
                    <li className="header-desc list-item">at UW</li>
                    <li className="header-desc list-item">in the Seattle area</li>
                    <li className="header-desc list-item">and beyond</li>
                    </ul>
                    </div>

                    </header>
                  </div>
                    <div className="container" id="home-content">
                    <div className="col-xs-12">
                        <h2>About Us</h2>
                        <div id="main-about-wrapper">
                        <p id="main-about">In this time of social and political conflict in the United States, INTL hopes to help international students in Seattle stay informed. We aim to unite and create a community in our area. INTL was created by three students at the University of Washington.</p>
                        <MuiThemeProvider>
                        <Link to="/about"><RaisedButton label="Learn more about INTL"></RaisedButton></Link>
                        </MuiThemeProvider>
                        </div>
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

//individual discussion preview items
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
