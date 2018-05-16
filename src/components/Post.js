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
import ReactLoading from "react-loading";
import ImageLazyLoaded from "./ImageLazyLoaded";
import ModalQuestion from "./ModalQuestion";
import {open} from "./stores/modalReducer"

class Post extends React.Component {
    state = {
        id: 0,
        title: '',
        description: '',
        content: '',
        comments: [],
        avatarUrl: '',
        user: '',
        currentUserIsAdmin: false,
        contentToReply: '',
        gotoPageId: '',
        tags: [],
        loading: false,
        message: '',
        deletePost: false,
        redirectToHome: false
    };

    async componentWillUnmount() {
        this.unsubscribe();
    }

    async componentDidMount(){
        this.setState({loading: true});

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
            /*blockRenderers: {
                atomic: (block) => {
                    return {
                        component: ImageLazyLoaded
                    }
                }
            },*/
            defaultBlockTag: 'p'
        };
        const content = stateToHTML(convertFromRaw(JSON.parse(data.content)), options);

        if(data){
            this.setState({
                id: data.id,
                title: data.title,
                description: data.description,
                avatarUrl: data.avatarUrl,
                content: content,
                tags: data.tags,
                loading: false
            });
        } else {
            this.setState({
                title: '',
                description: '',
                avatarUrl: '',
                content: '',
                tags: [],
                loading: false
            });
        }

        //get comments
        const comments = await get(`/api/posts/${id}/comments`);
        console.log(comments);
        if(comments.length > 0){
            this.setState({comments});
        }
    }

    async updateCurrentUser(){
        const {currentUser} = store.getState().authentication;

        if(currentUser) {

            const isAdmin = await get("/api/users/isAdmin");
            this.setState({
                user: currentUser,
                currentUserIsAdmin: isAdmin
            });
        } else {
            this.setState({
                user: ''
            })
        }
    }

    async onReplyButtonClick() {
        this.setState({loading: true});

        const comment = {
            content: this.state.contentToReply,
        }

        const {id} = this.props.match.params;
        try{
            const newComment = await post(`/api/posts/${id}/addNewComment`, comment);

            if(newComment) {

                this.setState({
                    comments: [
                        ...this.state.comments,
                        newComment
                    ],
                    loading: false,
                    message: "Add comment successful"
                });
            }
        } catch (e) {
            this.setState({
                loading: false,
                message: e.message
            });
            console.log(this.state.message);
        }

    }

    goToPreviousPage() {
        console.log("go to previous page");

    }

    goToNextPage() {
        console.log("go to next page");

    }

    switchPage(pageId) {
        this.setState({
            gotoPageId: pageId
        });
    }

    async deletePost() {
        const {id} = this.props.match.params;

        await fetch(`/api/posts/${id}/delete`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        this.setState({
            redirectToHome: true
        });

        store.dispatch(open("Delete done!"));

    }


    render(){
        if(this.state.redirectToRegister) {
            return (<Redirect to={`/user/register`}/>);
        }

        if(+this.state.gotoPageId !== 0) {
            return <Redirect to={`/posts/${this.state.gotoPageId}`}/>
        }

        if(this.state.redirectToHome) {
            console.log("i redirect to home");
            return <Redirect to={"/posts/"}/>
        }

        const elementHTML = ReactHtmlParser(this.state.content);

        let controlButtons = '';
        let replyForm = '';
        let loginButton = '';
        if(this.props.currentUser) {
            if(this.state.currentUserIsAdmin) {
                controlButtons = (
                    <div className="post-button">
                        <button className="ui button">
                            <Link to={`/posts/${this.state.id}/edit`}>
                                Edit
                            </Link>
                        </button>
                        <button className="ui button" onClick={() => this.setState({deletePost: true})}>
                            Delete
                        </button>
                    </div>
                );
            }

            replyForm = (
                <div>
                    <form className="ui reply form">
                        <div className="field">
                            <textarea value={this.state.contentToReply}
                                      onChange={(event) => this.setState({contentToReply: event.target.value})}
                            />
                        </div>

                        <button type="button" className="ui button" onClick={() => this.onReplyButtonClick()}>Add Reply</button>
                    </form>
                </div>);
        } else {
            loginButton =
                <div>
                    <Link to={{
                        pathname: '/user/login',
                        state: {currentState: this.props.match.url}
                        }}>
                        <div className="ui button">
                            Login to comment
                        </div>
                    </Link>
                    <Link to={'/user/register'}>
                        <div className="ui button">
                            Register
                        </div>
                    </Link>
                </div>
        }


        let comments = '';
        if(this.state.comments.length > 0) {
           comments = (
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
                   </div>
               </div>
           );
        }

        return (
            <div className="post">
                {this.state.loading &&
                    <div className="loading"><ReactLoading type="cubes" color="#666"/></div>
                }
                {controlButtons}

                {this.state.deletePost &&
                    <ModalQuestion deletePost={() => this.deletePost()}/>
                }

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
                    <div className="tag">
                        {this.state.tags.map((tag) => (
                            <div key={tag.id}>
                                <Link to={`/posts/tags/${tag.name}`}>
                                    <div className="item">#{tag.name}</div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="social-button">
                    <div className="likes">
                        <i className="heart outline icon" />
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
                    <div className="previous" onClick={() => this.goToPreviousPage()}>
                            Previous Page
                    </div>
                    <div>
                        <i className="th large icon" />
                    </div>
                    <div className="next">
                        <a onClick={() => this.goToNextPage()}>
                        Next Page
                        </a>
                    </div>
                </div>
                {comments}
                {replyForm}
                {loginButton}
            </div>
        );
    }
}

export default connect(
    (state) => state.authentication
) (Post);