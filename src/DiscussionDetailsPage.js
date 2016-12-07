import React from 'react';
import {IconButton, Dialog, DialogContent, DialogActions, Button} from 'react-mdl';
import {hashHistory} from 'react-router';
import firebase from 'firebase';
import Time from 'react-time';
import 'bootstrap/dist/css/bootstrap.css';
import noUserPic from './img/no-user-pic.png';

// the threshold for deleting the discussion,
// currently it is set to 2 so that any discussion
// that gets 2 dislikes will be delted automatically
const DELETE_DISCUSSION_THRESHOLD = 2;

class DiscussionDetailsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state={username:'',
                    userId:'',
                    photoURL:'',
                    title:'',
                    content:'',
                    createTime:'',
                    editTime:'',
                    likes:'',
                    dislikes:'',
                    conversations:[],
                    tooManyDislikesModalOpen:false,
                    deleteConfirmModalOpen:false};

        this.handleTooManyDislikes = this.handleTooManyDislikes.bind(this);
        this.openDeleteConfirmationModal = this.openDeleteConfirmationModal.bind(this);
        this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        /* Add a listener and callback for authentication events */
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                console.log('Auth state changed: logged in as' + user.email + ", " + user.photoURL);

                // listen for new discussions
                this.detailRef = firebase.database().ref('discussions/' + this.props.params.discussionId);              
                this.detailRef.on('value', (snapshot) => {
                    var obj = {};

                    snapshot.forEach((child) => {
                        if (child.key !== 'conversations' && child.key !== 'likes' && child.key !== 'dislikes') {
                            obj[child.key] = child.val();
                        }
                    });

                    this.setState(obj);
                });

                // listen for new conversations
                this.conversationsRef = firebase.database().ref('discussions/' + this.props.params.discussionId + "/conversations");
                this.conversationsRef.on('value', (snapshot) => {
                    var conversationsObjArray = [];

                    snapshot.forEach((child) => {
                        var obj = {};
                        obj['key'] = child.key;
                        obj['value'] = child.val();
                        conversationsObjArray.push(obj);
                    });

                    this.setState({conversations: conversationsObjArray});
                });

                // listen for new likes
                this.likesRef = firebase.database().ref('discussions/' + this.props.params.discussionId + "/likes");
                this.likesRef.on('value', (snapshot) => {
                    var likesObjs = {};

                    snapshot.forEach((child) => {
                        likesObjs[child.key] = child.val();
                    });

                    this.setState({likes: likesObjs});
                });

                // listen for new dislikes
                this.dislikesRef = firebase.database().ref('discussions/' + this.props.params.discussionId + "/dislikes");
                this.dislikesRef.on('value', (snapshot) => {
                    var dislikesObjs = {};
                    var count = 0;
                    snapshot.forEach((child) => {
                        dislikesObjs[child.key] = child.val();
                        count++;
                    });

                    // delete the post if this discussion gets 2 dislikes
                    if (count >= DELETE_DISCUSSION_THRESHOLD) {
                        firebase.database().ref('discussions/' + this.props.params.discussionId).remove().then(() => {
                            this.setState({tooManyDislikesModalOpen:true});
                        });
                    } else {
                        this.setState({dislikes: dislikesObjs});
                    }
                    
                });
            }
            else{
                console.log('Auth state changed: logged out');
                hashHistory.push("/login");
            }
        });
    }

    componentWillUnmount() {
        if(this.unregister) {
            this.unregister();
        }
        if (this.detailRef) {
            this.detailRef.off();
        }
        if (this.conversationsRef) {
            this.conversationsRef.off();
        }
        if (this.likesRef) {
            this.likesRef.off();
        }
        if (this.dislikesRef) {
            this.dislikesRef.off();
        }
    }

    handleTooManyDislikes(event) {
        event.preventDefault();
        hashHistory.push("/discussions");
    }

    openDeleteConfirmationModal() {
        this.setState({deleteConfirmModalOpen:true});
    }

    closeDeleteConfirmationModal() {
        this.setState({deleteConfirmModalOpen:false});
    }

    handleDelete(event) {
        event.preventDefault();
        firebase.database().ref('discussions/' + this.props.params.discussionId).remove();
        hashHistory.push("/discussions");
    }

    render() {
        var replies = this.state.conversations.map((conversationObj)=>{
            return <ReplyItem conversationDetails={conversationObj.value} key={conversationObj.key} discussionId={this.props.params.discussionId} threadId={conversationObj.key}/>
        });

        return (
            <div className="container">
                <div className="row">
                    <h1>{this.state.title}</h1>
                    <div className="col-xs-12">
                        <ul className="discussion-details-body">
                            <CreatorItem username={this.state.username}
                                        photoURL={this.state.photoURL}
                                        userId={this.state.userId}
                                        content={this.state.content}
                                        createTime={this.state.createTime}
                                        editTime={this.state.editTime}
                                        discussionId={this.props.params.discussionId}
                                        likes={this.state.likes}
                                        dislikes={this.state.dislikes}
                                        deleteCallBack={this.openDeleteConfirmationModal} />
                            {replies}
                        </ul>
                    </div>
                    <div className="col-xs-10 col-xs-offset-1">
                        <ReplyArea discussionId={this.props.params.discussionId} />
                    </div>
                </div>
                
                <Dialog open={this.state.tooManyDislikesModalOpen} >
                    <DialogContent>
                        this discussion got too many dislikes and will be deleted now...
                    </DialogContent>
                    <DialogActions fullWidth>
                        <Button type='button' onClick={this.handleTooManyDislikes} raised >take me to main discussion page</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.deleteConfirmModalOpen} >
                    <DialogContent>
                        Are you sure you want to delete this discussion? This cannot be undone!
                    </DialogContent>
                    <DialogActions>
                        <Button type='button' onClick={this.handleDelete} raised >yes</Button>
                        <Button type='button' onClick={this.closeDeleteConfirmationModal} raised >No!</Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

class ReplyItem extends React.Component {
    constructor(props) {
        super(props);

        var voteObj = this.calculateVotes(props.conversationDetails.votes);
        var state = {editMode:false};
        state['votes'] = voteObj['count'];
        state['voted'] = voteObj['bool'];

        this.state = state;

        this.handleUpVote = this.handleUpVote.bind(this);
        this.handleDownVote = this.handleDownVote.bind(this);
        this.updateVote = this.updateVote.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClickEdit = this.handleClickEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
    }

    // calculates the votes for this reply
    // also disables the vote button if a user
    // has voted already
    calculateVotes(objs) {
        var count = 0;
        var bool = false;
        if (objs) {
            Object.keys(objs).forEach((key) => {
                var obj = objs[key];
                var userId = obj["userId"];
                var vote = obj["vote"];
                if (userId === firebase.auth().currentUser.uid) {
                    bool = true;
                }
                count += vote;
            });
        }
        return {count: count, bool:bool};
    }

    handleUpVote(event) {
        event.preventDefault();
        this.updateVote(1);
    }

    handleDownVote(event) {
        event.preventDefault();
        this.updateVote(-1);
    }

    updateVote(value) {
        var objToBePushed = {'userId':firebase.auth().currentUser.uid, 'vote': value};
        firebase.database().ref('discussions/' + this.props.discussionId + "/conversations/" + this.props.threadId + "/votes").push(objToBePushed);
        this.setState({'votes': this.state.votes + value, 'voted':true});
    }

    handleDelete(event) {
        event.preventDefault();
        firebase.database().ref('discussions/' + this.props.discussionId + "/conversations/" + this.props.threadId).remove();
    }

    handleClickEdit(event) {
        event.preventDefault();
        this.setState({editMode:true});
    }

    handleEditSubmit(event) {
        event.preventDefault();
        var updatedContent = event.target.editContent.value;
        if (updatedContent !== this.props.conversationDetails.content) {
            var objectToBeUpdated = {'editTime': firebase.database.ServerValue.TIMESTAMP, 'content': updatedContent};
            firebase.database().ref('discussions/' + this.props.discussionId + "/conversations/" + this.props.threadId).update(objectToBeUpdated)
            .then(()=>{
                this.setState({editMode:false});
            });
        }
        

    }

    handleClose(event) {
        event.preventDefault();
        this.setState({editMode:false});
    }

    render() {
        var currentUser = firebase.auth().currentUser;
        var editAndDeleteButtonShown = (currentUser !== null ? (currentUser.uid === this.props.conversationDetails.userId) : false);
        var content = undefined;

        // conditional rendering depends on whether this user is in
        // edit mode or normal mode
        if (this.state.editMode) {
            content = (
                        <form id="replyEdit" onSubmit={this.handleEditSubmit}>
                            <textarea defaultValue={this.props.conversationDetails.content} name="editContent" type="text" className="form-control"></textarea>
                            <Button type="submit">Save</Button>
                            <Button onClick={this.handleClose}>Close</Button>
                        </form>  
                       );
        } else {
            content = <div className="content"><p>{this.props.conversationDetails.content}</p></div>
        }

        return(
            <li className="row">                    
                <div className="col-xs-1 votes-container">
                    <IconButton name="arrow_drop_up" disabled={this.state.voted} onClick={this.handleUpVote}/>
                    <div className="vote-num">{this.state.votes}</div>
                    <IconButton name="arrow_drop_down" disabled={this.state.voted} onClick={this.handleDownVote} />
                </div>
                <div className="col-xs-11">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="user-info-container">
                                <UserInfo photoURL={this.props.conversationDetails.photoURL} username={this.props.conversationDetails.username}/>
                                {editAndDeleteButtonShown && 
                                    <div className="item-controls">
                                        <Button onClick={this.handleClickEdit}>edit</Button>
                                        <Button onClick={this.handleDelete}>delete</Button>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-xs-12">
                            {content}
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 time-container">
                    <div className="time-info"><span>posted{' '}<Time value={this.props.conversationDetails.createTime} relative/></span>
                        {this.props.conversationDetails.createTime !== this.props.conversationDetails.editTime
                            && <span className="edit-time">edited{' '}<Time value={this.props.conversationDetails.editTime} relative/></span>}
                    </div>
                    <br />
                    <hr />
                </div>
            </li>
        );
    }
}

// this component represents the discussion created by the owner
class CreatorItem extends React.Component {
    constructor(props) {
        super(props);

        var likeObj = this.calculateLikesAndDislikes(props.likes);
        var dislikeObj = this.calculateLikesAndDislikes(props.dislikes);

        var state = {editMode:false};
        state['likes'] = likeObj['count'];
        state['liked'] = likeObj['bool'];
        state['dislikes'] = dislikeObj['count'];
        state['disliked'] = dislikeObj['bool'];

        this.state = state;

        this.handleLike = this.handleLike.bind(this);
        this.handleDislike = this.handleDislike.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    // calculates the likes and dislikes for this discussion
    calculateLikesAndDislikes(objs) {
        var count = 0;
        var bool = false;
        if (objs) {
            Object.keys(objs).forEach((key) => {
                count++;
                if (objs[key] === firebase.auth().currentUser.uid) {
                    bool = true;
                }
            });
        }
        return {count: count, bool:bool};
    }

    // re-calculate likes and dislikes when it has received new
    // data, and also updates the likes or dislikes button
    componentWillReceiveProps(nextProps) {
        var obj = {};
        Object.keys(nextProps).forEach((key) => {
            if (key !== 'likes' && key !== 'dislikes' && this.props[key] !== nextProps[key]) {
                obj = {};
                obj[key] = nextProps[key];
                this.setState(obj);
            } else if (key === 'likes') {
                obj = this.calculateLikesAndDislikes(nextProps[key]);
                this.setState({'likes': obj.count, 'liked':obj.bool});
            } else if (key === 'dislikes') {
                obj = this.calculateLikesAndDislikes(nextProps[key]);
                this.setState({'dislikes': obj.count, 'disliked':obj.bool});
            }
        });

    }

    handleLike(event) {
        event.preventDefault();

        firebase.database().ref('discussions/' + this.props.discussionId + "/likes").push(firebase.auth().currentUser.uid);

        // update the front ui immediately even though it might not have been got to the server yet
        this.setState({likes:this.state.likes + 1, liked:true});
    }

    handleDislike(event) {
        event.preventDefault();

        firebase.database().ref('discussions/' + this.props.discussionId + "/dislikes").push(firebase.auth().currentUser.uid);

        // update the front ui immediately even though
        this.setState({dislikes:this.state.dislikes + 1, disliked:true});
    }

    handleDelete(event) {
        event.preventDefault();
        this.props.deleteCallBack();
    }

    handleEditSubmit(event) {
        event.preventDefault();
        var updatedContent = event.target.editContent.value;
        if (updatedContent !== this.props.content) {
            var objToBeUpdated = {'content':updatedContent, 'editTime':firebase.database.ServerValue.TIMESTAMP};
            firebase.database().ref('discussions/' + this.props.discussionId).update(objToBeUpdated)
            .then(() => { this.setState({editMode:false}); });
        } else {
            this.setState({editMode:false});
        }
    }

    handleEditClick(event) {
        this.setState({editMode:true});
    }

    handleClose(event) {
        event.preventDefault();
        this.setState({editMode:false});
    }

    render() {
        var likeOrDislikeButtonEnabled = (!this.state.liked && !this.state.disliked);
        var currentUser = firebase.auth().currentUser;
        var editAndDeleteButtonShown = (currentUser !== null ? (currentUser.uid === this.props.userId) : false);
        var content = undefined;
        if (this.state.editMode) {
            content = (
                        <form id="discussionEdit" onSubmit={this.handleEditSubmit}>
                            <textarea defaultValue={this.props.content} name="editContent" type="text" className="form-control"></textarea>
                            <Button type="submit">Save</Button>
                            <Button onClick={this.handleClose}>Close</Button>
                        </form>  
                       );
        } else {
            content = <div className="content">{this.props.content}</div>;
        }

        return (
            <li className="creator-item">
                <div className="creator-container">
                    <div className="user-info-container">
                        <UserInfo photoURL={this.props.photoURL} username={this.props.username}/>
                        {editAndDeleteButtonShown && 
                            <div className="item-controls">
                                <Button onClick={this.handleEditClick}>edit</Button>
                                <Button onClick={this.handleDelete}>delete</Button>
                            </div>
                        }
                    </div>
                    <div>{content}</div>
                    <div className="time-container">
                        <span className="thumb-up"><IconButton name="thumb_up" onClick={this.handleLike} disabled={!likeOrDislikeButtonEnabled} />{' '}{this.state.likes}</span>{' '}
                        <span className="thumb-down thumb-down-container"><IconButton name="thumb_down" onClick={this.handleDislike} disabled={!likeOrDislikeButtonEnabled} />{' '}{this.state.dislikes}</span>
                        <div className="time-info"><span>created{' '}<Time value={this.props.createTime} relative/></span>
                        {this.props.createTime !== this.props.editTime
                            && <span className="edit-time">edited{' '}<Time value={this.props.editTime} relative/></span>}
                        </div>
                    </div>
                </div>
                <hr />
            </li>
        );
    }
}

// this component represents the reply area on the discussion details page
class ReplyArea extends React.Component {
    constructor(props) {
        super(props);

        this.handleReply = this.handleReply.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state= {replyContent:''};
    }

    handleReply(event) {
        event.preventDefault();
        // need to figure out how to encode line break;
        var replyContent = event.target.replyArea.value;
        if (replyContent !== '') {
            var currentUser = firebase.auth().currentUser;
            var objToBePushed = {"username":currentUser.displayName,
                                 "photoURL": currentUser.photoURL,
                                 "userId":currentUser.uid,
                                 "createTime": firebase.database.ServerValue.TIMESTAMP,
                                 "editTime": firebase.database.ServerValue.TIMESTAMP,
                                 "content": replyContent};

            firebase.database().ref('discussions/' + this.props.discussionId + "/conversations").push(objToBePushed)
            .then(() => {
                this.setState({replyContent:''});
            });
        }

    }

    handleInputChange(event) {
        this.setState({replyContent: event.target.value});
    }

    render() {
        return (
            <div>
                <form id="replyForm" onSubmit={this.handleReply}>
                    <textarea className="form-control" name="replyArea" onChange={this.handleInputChange} value={this.state.replyContent} rows="10"></textarea>
                    <Button colored>Reply</Button>
                </form>
            </div>
        );
    }
}

// this component represents the user info section inside each reply thread
class UserInfo extends React.Component {
    render() {
        var imgStyle={'borderColor': this.props.photoURL};
        return(
            <div className="user-info">
                <img  src={noUserPic} style={imgStyle} role="presentation" />
                <span className="user-name">{this.props.username}</span>
            </div>
        );
    }
}

export default DiscussionDetailsPage;