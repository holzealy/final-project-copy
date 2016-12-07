import React from 'react';
import { Link, hashHistory } from 'react-router';
import { Button } from 'react-mdl';
import firebase from 'firebase';
import moment from 'moment';


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
          <div className="header-cont">
            <header className="main-header events-header">
            <div className="header-text">
            <h1 className="header-title">Events</h1>
            <p className="header-desc">Meet up withs peers in the area!</p>
            </div>
            </header>
            </div>
            <br/>
            <div className='container'>
                    <NewEvent />
                    <EventsList />
            </div>
          </div>
        );
    }
}

//box for submitting a new event to the page
class NewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { title: "", date: "", time: "", location: "", description: "" };
        
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    //handles field input and stores in state
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
        //reset input fields
        this.setState({
            title: "",
            date: "",
            time: "",
            location: "",
            description: ""
        });
        //add event data to firebase db
        eventsRef.push(eventData);
    }

    render() {
        //for submit button
        var postEnabled = (this.state.title !== '' && this.state.date !== '' && this.state.time !== '' && this.state.location !== '' && this.state.description !== '');

        return (
            <div className="col-xs-10 col-xs-offset-1 list-group-item">
                <h2>Add a new event</h2>
                <form>
                    <input type="text" className="form-control" value={this.state.title} onChange={(event) => this.handleInputChange(event, "title")} placeholder="Title" /> <br />
                    <input type="date" className="form-control" value={this.state.date} onChange={(event) => this.handleInputChange(event, "date")} placeholder="Date" /> <br />
                    <input type="text" className="form-control" value={this.state.time} onChange={(event) => this.handleInputChange(event, "time")} placeholder="Time" /> <br />
                    <input type="text" className="form-control" value={this.state.location} onChange={(event) => this.handleInputChange(event, "location")} placeholder="Location" /> <br />
                    <textarea type="text" className="form-control" value={this.state.description} onChange={(event) => this.handleInputChange(event, "description")} placeholder="Event description" /> <br />
                </form>
                <Button type="button" onClick={(event) => this.handlePostEvent(event)} aria-label="post event" colored raised disabled={!postEnabled}>Post Event</Button>
            </div>
        );
    }
}

//holds all event items
class EventsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { events: [] };
    }

    componentWillMount() {
        //orders by closest date at the top
        this.eventsRef = firebase.database().ref('events').orderByChild('date');
        this.eventsRef.on('value', (snapshot) => {
            var eventsArray = [];
            snapshot.forEach(function (child) {
                var event = child.val();
                event.key = child.key;
                eventsArray.push(event);
            });
            //updates event list
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
            //only shows events that are from today on
            if (eventDate > yesterday) {
                return <EventItem event={event} eventId={event.key} key={event.key} />
            } else {
                return null;
            }
        });

        return (
            <div className="col-xs-10 col-xs-offset-1">
                <h2>Upcoming Events</h2>
                {eventItems}
            </div>
        );
    }
}


class EventItem extends React.Component {
    render() {
        return (
            <div className="post">
                <Link to={"/event/" + this.props.eventId} className="list-group-item">
                    <h2 className="list-group-item-heading">{this.props.event.title}</h2>
                    <p><span className="event-info">Date</span>: {this.props.event.date}</p>
                    <p><span className="event-info">Time</span>: {this.props.event.time}</p>
                    <p><span className="event-info">Location</span>: {this.props.event.location}</p>
                    <hr />
                    <p className="list-group-item-text event-description">
                        {this.props.event.description}
                    </p>
                    <br />
                    <p>Event created <span className="event-info">{moment(this.props.event.postTime).fromNow()}</span> by <span className="event-info">{this.props.event.displayName}</span></p>
                </Link>
            </div>
        );
    }
}

export default EventsPage;
