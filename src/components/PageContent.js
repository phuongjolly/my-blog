import React from "react"
import "./PageContent.css"
import {Link} from "react-router-dom";
import {get} from "./Http"
import {connect} from "react-redux";
import ReactLoading from "react-loading"

class PageContent extends React.Component {
    state = {
        posts: [],
        currentUserIsAdmin: false,
        loading: false
    };

    componentWillReceiveProps(newProps, oldProps) {
        const {name} = newProps.match.params;
        const oldName = this.props.match.params.name;

        if (name !== oldName) {
            this.loadPosts(name);
        }
    }

    async loadPosts(name) {
        let posts;

        this.setState({
            loading: true
        });

        if (name === undefined){
            posts = await get(`/api/posts/`);
        } else {
            posts = await get(`/api/posts/tags/${name}`);
        }

        this.setState({posts});

        try{
            const currentUser = await get("/api/users/currentUser");
            if(currentUser) {
                console.log("i am here");
                let isAdmin = false;
                if(currentUser) {
                    isAdmin = await get("/api/users/isAdmin");
                }
                this.setState({
                    currentUserIsAdmin: isAdmin,
                });
            }
        } catch (e) {

        }

        this.setState({
            loading: false
        })
    }

    componentDidMount() {
        const {name} = this.props.match.params;
        this.loadPosts(name);
    }

    render () {

        let addNewButton = '';
        if(this.props.currentUser && this.state.currentUserIsAdmin) {
            addNewButton = (
                <div className="item-box">
                    <div className="addNew">
                        <Link to={`/posts/add`}>
                            <i className="plus icon"/>
                        </Link>
                    </div>
                </div>
            );
        }
        return (
            <div className="page-container">
                {this.state.loading &&
                    <div className="loading"><ReactLoading type="cubes" color="#666"/></div>}
                {this.state.posts.map((post) => (
                    post.display && (
                        <div className="item-box" key={post.id}>
                            <div className="photo">
                                <Link to={`/posts/${post.id}`}>
                                    <img src={post.avatarUrl} alt="myBlog"/>
                                </Link>
                            </div>
                            <div className="info-content">
                                <div className="info-header">{post.title}</div>
                                <div className="info-detail">
                                    {post.description}
                                </div>
                            </div>
                        </div>
                    )
                ))}
                {addNewButton}
            </div>
        );
    }
}

export default connect (
    (state) => state.authentication
)(PageContent);
