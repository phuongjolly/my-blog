import {convertFromRaw} from "draft-js";
import {stateToHTML} from 'draft-js-export-html';
import React from "react";
import ReactHtmlParser from 'react-html-parser'
import "./Post.css"
import "./PostEditor.css"
import {get, post} from "./Http";
import {Link, Redirect} from "react-router-dom";
import store from "./stores/store"

import {ALIGNMENT_DATA_KEY} from "./plugins/ExtendedRichUtils";
import {connect} from "react-redux";

class Post extends React.Component {
    state = {
        id: 0,
        title: '',
        description: '',
        content: '',
        comments: [],
        avatarUrl: '',
        currentUserId: 0,
        currentUserName: '',
        contentToReply: '',
        redirectToLogin: false
    };

    async componentWillUnmount() {
        this.unsubscribe();
    }

    async componentDidMount(){
        this.updateCurrentUser();
        this.unsubscribe = store.subscribe(() => this.updateCurrentUser());

        const {id} = this.props.match.params;
        const data = await get(`/api/posts/${id}`);
        let options = {
            inlineStyles: {
                BOLD: {element: 'b'},
                ITALIC: {
                    element: 'i',
                },
                UNDERLINE: {
                    element: 'u'
                }
            },
            blockStyleFn: (block) =>{
                const textAlignStyle = block.getData().get(ALIGNMENT_DATA_KEY);
                switch (textAlignStyle){
                    case 'RIGHT':
                        return {
                            element: 'div',
                            attributes: {class: 'align-right'},
                        }

                    case 'CENTER':
                        return {
                            element: 'div',
                            attributes: {class: 'align-center'}
                        }
                    case 'LEFT':
                        return {
                            element: 'div',
                            attributes: {class: 'align-left'}
                        }
                    case 'JUSTIFY':
                        return {
                            element: 'div',
                            attributes: {class: 'align-justify'}
                        }
                    default:
                        return '';
                }
            },

            defaultBlockTag: 'div'
        };
        const content = stateToHTML(convertFromRaw(JSON.parse(data.content)), options);

        if(data){
            this.setState({
                id: data.id,
                title: data.title,
                description: data.description,
                avatarUrl: data.avatarUrl,
                content: content,
            });
        } else {
            this.setState({
                title: '',
                description: '',
                avatarUrl: '',
                content: ''
            });
        }

        //get comments
        const comments = await get(`/api/posts/${id}/comments`);
        console.log(comments);
        if(comments.length > 0){
            this.setState({comments});
        }

    }

    updateCurrentUser(){
        const {currentUser} = store.getState().authentication;
        if(currentUser) {
            this.setState({
                currentUserId: currentUser.id,
                currentUserName: currentUser.name
            });
        } else {
            this.setState({
                currentUserId: 0,
                currentUserName: ''
            })
        }
    }

    onLoginButtonClick(){
        this.setState({
            redirectToLogin: true
        });
    }

    async onReplyButtonClick() {
        const {currentUser} = store.getState().authentication;
        const comment = {
            content: this.state.contentToReply,
            user: currentUser,
        }
        const {id} = this.props.match.params;
        const response = await post(`/api/posts/${id}/addNewComment`, comment);

        if(response) {
            console.log("add comment ok");
            console.log(response);
            this.setState({
                comments: [
                    ...this.state.comments,
                    comment
                ]
            });
        }
    }

    render(){
        const elementHTML = ReactHtmlParser(this.state.content);
        let $replyForm = '';
        let $loginButton = '';

        if(+this.state.currentUserId > 0) {
            $replyForm = (
                <div>
                    <form className="ui reply form">
                        <div className="field">
                            <textarea aria-valuetext={this.state.contentToReply}
                                onChange={(event) => this.setState({contentToReply: event.target.value})}
                            ></textarea>
                        </div>
                        <div className="ui blue labeled submit icon button">
                            <button type="button" onClick={() => this.onReplyButtonClick()}>Add Reply</button>
                        </div>
                    </form>
                </div>);
        } else {
            $loginButton =
                <div className="login-button">
                    <button className="ui button" onClick={() => this.onLoginButtonClick()}> Login to comment </button>
                </div>
        }

        if(this.state.redirectToLogin) {
            return (<Redirect to={`/user/login`}/>);
        }

        let $comments = '';
        if(this.state.comments.length > 0) {
           $comments = (
               <div className="post-comments">
                   <div className="ui threaded comments">
                       <h3 className="ui dividing header">Comments</h3>
                       {this.state.comments.map((comment) => (
                           <div className="comment" key={comment.id}>
                               <a className="avatar">
                                   <img src="https://semantic-ui.com/images/avatar/small/matt.jpg" alt="avatar"/>
                               </a>
                               <div className="content" >
                                   <a className="author">{comment.user.name}</a>
                                   <div className="metadata">
                                       <span className="date">{comment.date}</span>
                                   </div>
                                   <div className="text">
                                       {comment.content}
                                   </div>
                                   <div className="actions">
                                       <button type="button">Reply</button>
                                   </div>
                               </div>
                           </div>
                       ))}
                       {$replyForm}

                   </div>
               </div>
           );
        }

        let $editButton = '';
        if(this.props.currentUser) {
            $editButton = (
                <div className="post-button">
                    <button className="ui button">
                        <Link to={`/posts/${this.state.id}/edit`}>
                            Edit
                        </Link>
                    </button>
                </div>
            );
        }

        return (
            <div className="post">
                {$editButton}
                <div>
                    <div className="post-title">
                        <h1>
                            {this.state.title}
                        </h1>
                    </div>
                    <div className="post-description">
                        <p>
                            {this.state.description}
                        </p>
                    </div>
                    <div className="editor">
                        <div className="DraftEditor-root">
                            <div className="DraftEditor-editorContainer">
                                {elementHTML}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="social-button">
                    <div className="likes">
                        <i className="heart outline icon"></i>
                        <p>157</p>
                    </div>
                    <div className="shares">
                        <h4>Share</h4>
                        <div className="social-links">
                            <a href="https://www.facebook.com">Facebook</a>
                            <a href="https://www.facebook.com">Twitter</a>
                            <a href="https://www.facebook.com">Google+</a>
                            <a href="https://www.facebook.com">Email</a>
                        </div>
                    </div>
                </div>
                <div className="navigation">
                    <div className="previous">Previous Page</div>
                    <div>
                        <i className="th large icon"></i>
                    </div>
                    <div className="next">Next Page</div>
                </div>
                {$comments}
                {$loginButton}
            </div>
        );
    }
}

export default connect(
    (state) => state.authentication
) (Post);