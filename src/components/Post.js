import {convertFromRaw} from "draft-js";
import {stateToHTML} from 'draft-js-export-html';
import React from "react";
import ReactHtmlParser from 'react-html-parser'
import "./Post.css"
import "./PostEditor.css"
import { get } from "./Http";
import {Link, Redirect} from "react-router-dom";
import store from "./stores/store"

import {ALIGNMENT_DATA_KEY} from "./plugins/ExtendedRichUtils";

class Post extends React.Component {
    state = {
        id: 0,
        title: '',
        description: '',
        content: '',
        avatarUrl: '',
        currentUserId: 0,
        currentUserName: '',
        redirectToLogin: false
    };

    async componentWillUnmount() {
        this.unsubscribe();
    }

    async componentDidMount(){
        this.updateCurrentUser();
        this.unsubscribe = store.subscribe(() => this.updateCurrentUser().authentication);

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


    }

    updateCurrentUser(){
        const {currentUser} = store.getState();
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

    render(){
        const elementHTML = ReactHtmlParser(this.state.content);
        let $replyForm = '';
        let $loginButton = '';
        console.log("current user id" + this.state.currentUserId);
        if(+this.state.currentUserId > 0) {
            $replyForm = (
                <div>
                    <form className="ui reply form">
                        <div className="field">
                            <textarea></textarea>
                        </div>
                        <div className="ui blue labeled submit icon button">
                            <i className="icon edit"></i> Add Reply
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

        return (
            <div className="post">
                <div className="post-button">
                    <button className="ui button">
                        <Link to={`/posts/${this.state.id}/edit`}>
                            Edit
                        </Link>
                    </button>
                </div>
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
                <div className="post-comments">
                    <div className="ui threaded comments">
                        <h3 className="ui dividing header">Comments</h3>
                        <div className="comment">
                            <a className="avatar">
                                <img src="https://semantic-ui.com/images/avatar/small/matt.jpg" alt="avatar"/>
                            </a>
                            <div className="content">
                                <a className="author">Matt</a>
                                <div className="metadata">
                                    <span className="date">Today at 5:42PM</span>
                                </div>
                                <div className="text">
                                    How artistic!
                                </div>
                                <div className="actions">
                                    <a className="reply">Reply</a>
                                </div>
                            </div>
                        </div>
                        <div className="comment">
                            <a className="avatar">
                                <img src="https://semantic-ui.com/images/avatar/small/elliot.jpg" alt="avatar" />
                            </a>
                            <div className="content">
                                <a className="author">Elliot Fu</a>
                                <div className="metadata">
                                    <span className="date">Yesterday at 12:30AM</span>
                                </div>
                                <div className="text">
                                    <p>This has been very useful for my research. Thanks as well!</p>
                                </div>
                                <div className="actions">
                                    <a className="reply">Reply</a>
                                </div>
                            </div>
                            <div className="comments">
                                <div className="comment">
                                    <a className="avatar">
                                        <img src="https://semantic-ui.com/images/avatar/small/jenny.jpg" alt="avatar"/>
                                    </a>
                                    <div className="content">
                                        <a className="author">Jenny Hess</a>
                                        <div className="metadata">
                                            <span className="date">Just now</span>
                                        </div>
                                        <div className="text">
                                            Elliot you are always so right :)
                                        </div>
                                        <div className="actions">
                                            <a className="reply">Reply</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="comment">
                            <a className="avatar">
                                <img src="https://semantic-ui.com/images/avatar/small/joe.jpg" alt="avatar" />
                            </a>
                            <div className="content">
                                <a className="author">Joe Henderson</a>
                                <div className="metadata">
                                    <span className="date">5 days ago</span>
                                </div>
                                <div className="text">
                                    Dude, this is awesome. Thanks so much
                                </div>
                                <div className="actions">
                                    <a className="reply">Reply</a>
                                </div>
                            </div>
                        </div>
                        {$replyForm}
                        {$loginButton}
                    </div>
                </div>
            </div>
        );
    }
}

export default Post;