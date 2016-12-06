import React from 'react';
import { Link, hashHistory } from 'react-router';
import { Grid, Cell, Button } from 'react-mdl';
import firebase from 'firebase';
import moment from 'moment';
import eventsbanner from './img/eventsbanner.jpg';


class EventsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { events: [] };
    }
    componentDidMount() {
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                hashHistory.push("/login");
            }
        });
    }

    componentWillUnmount() {
        //unregister user and message listeners
        if (this.unregister) {
            this.unregister();
        }
    }

    render() {
        return (
            <div>
                <img className="banner" src={eventsbanner} role="presentation" />
                <h1>Events</h1>
                <Grid>
                    <NewEvent />
                    <EventsList />
                </Grid>
            </div>
        );
    }
}

class NewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { title: "", date: "", time: "", location: "", description: "" };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    //handles title input
    handleInputChange(event, field) {
        this.setState({ [field]: event.target.value });
    }

    handlePostEvent(event) {
        event.preventDefault();
        var user = firebase.auth().currentUser;
        var eventsRef = firebase.database().ref("events");
        //data about the event to store
        var eventData = {
            userId: user.uid,
            displayName: user.displayName,
            title: this.state.title,
            date: this.state.date,
            time: this.state.time,
            location: this.state.location,
            description: this.state.description,
            postTime: firebase.database.ServerValue.TIMESTAMP
        }
        this.setState({
            title: "",
            date: "",
            time: "",
            location: "",
            description: ""
        });
        eventsRef.push(eventData);
    }

    render() {
        var postEnabled = (this.state.title !== '' && this.state.date !== '' && this.state.time !== '' && this.state.location !== '' && this.state.description !== '');

        return (
            <Cell col={12} className="list-group-item">
                <h2>Add a new event</h2>
                <form>
                    <input type="text" className="form-control" value={this.state.title} onChange={(event) => this.handleInputChange(event, "title")} placeholder="Title" /> <br />
                    <input type="date" className="form-control" value={this.state.date} onChange={(event) => this.handleInputChange(event, "date")} placeholder="Date" /> <br />
                    <input type="text" className="form-control" value={this.state.time} onChange={(event) => this.handleInputChange(event, "time")} placeholder="Time" /> <br />
                    <input type="text" className="form-control" value={this.state.location} onChange={(event) => this.handleInputChange(event, "location")} placeholder="Location" /> <br />
                    <textarea type="text" className="form-control" value={this.state.description} onChange={(event) => this.handleInputChange(event, "description")} placeholder="Event description" /> <br />
                </form>
                <Button type="button" onClick={(event) => this.handlePostEvent(event)} aria-label="post event" colored raised disabled={!postEnabled}>Post Event</Button>
            </Cell>
        );
    }
}

class EventsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { events: [] };
    }

    componentWillMount() {
        this.eventsRef = firebase.database().ref('events').orderByChild('date');
        this.eventsRef.on('value', (snapshot) => {
            var eventsArray = [];
            snapshot.forEach(function (child) {
                var event = child.val();
                event.key = child.key;
                eventsArray.push(event);
            });
            //updates list
            this.setState({ events: eventsArray });
        });
        //listens for changes to user obj in database and stores in state
        this.usersRef = firebase.database().ref('users');
        this.usersRef.on('value', (snapshot) => {
            this.setState({ users: snapshot.val() });
        });
    }

    componentWillUnmount() {
        //unregister user and message listeners
        // firebase.database().ref('events').off();
        // firebase.database().ref('users').off();
        if (this.usersRef) {
            this.usersRef.off();
        }
        if (this.eventsRef) {
            this.eventsRef.off();
        }
    }

    render() {
        var yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        yesterday = yesterday.getTime();
        var eventItems = this.state.events.map((event) => {
            var eventDate = Date.parse(event.date);
            if (eventDate > yesterday) {
                return <EventItem event={event} eventId={event.key} key={event.key} />
            } else {
                return null;
            }
        });

        return (
            <Cell col={12}>
                <h2>Upcoming Events</h2>
                {eventItems}
            </Cell>
        );
    }
}


class EventItem extends React.Component {
    render() {
        return (
            <Link to={"/event/" + this.props.eventId} className="list-group-item">
                <h2 className="list-group-item-heading">{this.props.event.title}</h2>
                <p>Date: {this.props.event.date}</p>
                <p>Time: {this.props.event.time}</p>
                <p>Location: {this.props.event.location}</p>
                <hr />
                <p className="list-group-item-text event-description">
                    {this.props.event.description}
                </p>
                <br />
                <p>Event created {moment(this.props.event.postTime).fromNow()}by {this.props.event.displayName}</p>
            </Link>
        );
    }
}

export default EventsPage;