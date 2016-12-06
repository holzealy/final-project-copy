import React from 'react';
import { Link, hashHistory } from 'react-router';
import { Grid, Cell } from 'react-mdl';
import firebase from 'firebase';
import moment from 'moment';

class EventDetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            displayName: '',
            title: '',
            date: '',
            time: '',
            location: '',
            description: '',
            postTime: ''
        };
    }

    componentDidMount() {
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.eventDetailsRef = firebase.database().ref('events/' + this.props.params.eventId);
                this.eventDetailsRef.on('value', (snapshot) => {
                    var eventObj = {};
                    snapshot.forEach((child) => {
                        eventObj[child.key] = child.val();
                    });
                    this.setState(eventObj);
                });
            }
            else {
                hashHistory.push("/login");
            }
        });
    }

    componentWillUnmount() {
        if (this.eventDetailsRef) {
            this.eventDetailsRef.off();
        }
        if (this.unregister) {
            this.unregister();
        }
    }


    render() {
        return (
            <Grid>
                <Cell col={12}>
                    <h1>{this.state.title}</h1>
                </Cell>
                <Cell col={12} className="list-group-item">
                    <p>Date: {this.state.date}</p>
                    <p>Time: {this.state.time}</p>
                    <p>Location: {this.state.location}</p>
                    <hr />
                    <p className="list-group-item-text">
                        {this.state.description}
                    </p>
                    <br />
                    <p>Event created {moment(this.state.postTime).fromNow()}by {this.state.displayName}</p>
                </Cell>
                <Cell>
                    <Link to={"/events"}>Back to all events</Link>
                </Cell>
            </Grid>
        );
    }
}

export default EventDetailsPage;