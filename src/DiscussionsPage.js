import React from 'react';
import { Link } from 'react-router';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, Spinner, Icon } from 'react-mdl';
import 'bootstrap/dist/css/bootstrap.css';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import Time from 'react-time';



class DiscussionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { modalOpen: false, title: '', content: '', discussions: [], showSpinner: false };
        this.openModal = this.openModal.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleContentInputChange = this.handleContentInputChange.bind(this);
        this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    }

    componentDidMount() {
        /* Add a listener and callback for authentication events */
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('Auth state changed: logged in as', user.email);
                this.discussionsRef = firebase.database().ref('discussions');
                this.discussionsRef.on('value', (snapshot) => {
                    var discussionsArray = [];
                    snapshot.forEach((child) => {
                        var obj = { 'discussionId': child.key, 'discussionObj': child.val() };
                        discussionsArray.push(obj);
                    });

                    discussionsArray.sort((a, b) => {
                        return b.discussionObj.createTime - a.discussionObj.createTime;
                    });

                    this.setState({ discussions: discussionsArray });
                });
            }
            else {
                console.log('Auth state changed: logged out');
                hashHistory.push("/login");
            }
        });
    }

    componentWillUnmount() {
        if (this.unregister) {
            this.unregister();
        }
        if (this.discussionsRef) {
            this.discussionsRef.off();
        }
    }


    openModal() {
        this.setState({ modalOpen: true });
    }

    // callback function when the user hit the create button
    handleCreate(event) {
        event.preventDefault();
        var discussionsRef = firebase.database().ref('discussions');
        var currentUser = firebase.auth().currentUser;
        var objToBePushed = {
            "username": currentUser.displayName,
            "userId": currentUser.uid,
            "photoURL": currentUser.photoURL,
            "title": this.state.title,
            "createTime": firebase.database.ServerValue.TIMESTAMP,
            "editTime": firebase.database.ServerValue.TIMESTAMP,
            "content": this.state.content
        };
        this.setState({ showSpinner: true });
        discussionsRef.push(objToBePushed).then(() => {
            this.setState({ modalOpen: false, title: '', content: '', showSpinner: false });
        });
    }

    closeModal(event) {
        event.preventDefault();
        this.setState({ modalOpen: false });
    }

    handleTitleInputChange(event) {
        this.setState({ title: event.target.value });
    }

    handleContentInputChange(event) {
        this.setState({ content: event.target.value });
    }

    render() {
        var result = this.state.discussions.map((discussion) => {
            return (<DiscussionItem key={discussion.discussionId} discussionId={discussion.discussionId} discussionObj={discussion.discussionObj} />);
        });

        var createButtonEnabled = (this.state.title !== '' && this.state.content !== '');

        var spinnerSytle = { 'display': 'none' };
        if (this.state.showSpinner) {
            spinnerSytle = {};
        }

        return (
            <div>
            <div className="header-cont">
                <header className="main-header discussion-header">
                    <div className="header-text">
                        <h1 className="header-title">Discussions</h1>
                        <p className="header-desc">Ask or discuss & your peers will respond</p>
                    </div>
                </header>
            </div>
                <br />
                <div className="container">
                <div className="col-xs-10 col-xs-offset-1">
                    <Button className="button-create" raised colored onClick={this.openModal}> Create New Discussion </Button>
                </div>
                    <div className="row">
                        <div className="col-xs-10 col-xs-offset-1">
                            <div className="list-group">
                                {result}
                            </div>
                        </div>
                    </div>
                    <Dialog open={this.state.modalOpen} style={{ 'width': '100%', 'height': '100%' }} >
                        <DialogTitle style={{width: "60%", margin:"auto"}}>Create a new discussion post</DialogTitle>
                        <DialogContent style={{width: "60%", margin:"auto"}}>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="discussionTitleInput">Title</label> {' '}
                                    <input type="text" className="form-control" id="discussionTitleInput" onChange={this.handleTitleInputChange} placeholder="title" value={this.state.title} />
                                </div>
                                <div className="form-group">
                                    <textarea type="text" className="form-control" onChange={this.handleContentInputChange} placeholder="discussion content" value={this.state.content} />
                                </div>
                            </form>
                        </DialogContent>
                        <DialogActions style={{width: "60%", margin:"auto"}}>
                            <Button type='button' onClick={this.handleCreate} colored raised disabled={!createButtonEnabled}><Spinner style={spinnerSytle} />{' '}Create</Button>
                            <Button type='button' onClick={this.closeModal} colored raised>Discard</Button>
                        </DialogActions>
                        {!createButtonEnabled && <div className="has-error" style={{width: "60%", margin:"auto"}}><div className="help-block creat-post-error-message">title or content cannot be empty</div></div>}
                    </Dialog>
                </div>
            </div>
        );
    }
}

// this component represents a single thread on the discussion page
class DiscussionItem extends React.Component {
    count(obj) {
        if (obj) {
            return Object.keys(obj).length;
        }
        return 0;
    }
    render() {
        var likes = this.count(this.props.discussionObj.likes);
        var dislikes = this.count(this.props.discussionObj.dislikes);

        return (
            <div className="post">
                <Link to={"/discussion/" + this.props.discussionId} className="list-group-item list-group-item-action">
                    <h1 className="list-group-item-heading">{this.props.discussionObj.title}</h1>
                    <p className="list-group-item-text dicussion-content">{this.props.discussionObj.content}</p>
                    <br />
                    <div className="list-group-item-text time-container">
                        <span>Read more</span>
                        <div></div>
                        <span>
                            <span><Icon name="thumb_up" /></span>{' '}
                            <span className="thumb-up">{' '}{likes}</span>
                        </span>
                        <span className="thumb-down-container">
                            <span><Icon name="thumb_down" /></span>{' '}
                            <span className="thumb-down" >{' '}{dislikes}</span>
                        </span>
                        <div className="time-info">
                            <span>created{' '}<Time value={this.props.discussionObj.createTime} relative /></span>
                            {this.props.discussionObj.createTime !== this.props.discussionObj.editTime
                                && <span className="edit-time">edited{' '}<Time value={this.props.discussionObj.editTime} relative /></span>}
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default DiscussionPage;
