import React from "react"
import "./PageContent.css"
import {Link} from "react-router-dom";
import {get} from "./Http"
import {connect} from "react-redux";

class PageContent extends React.Component {
    state = {
        posts: [],
        currentUserIsAdmin: false,
    };

    async componentDidMount() {
        const posts = await get("/api/posts");
        console.log(posts);
        this.setState({posts});

        const currentUser = await get("/api/users/currentUser");
        if(currentUser) {
            let isAdmin = false;
            if(currentUser) {
                isAdmin = await get("/api/users/isAdmin");
            }
            this.setState({
                currentUserIsAdmin: isAdmin,
            });
        }



    }
    render () {

        let addNewButton = '';
        if(this.props.currentUser && this.state.currentUserIsAdmin) {
            addNewButton = (
                <div className="addNew">
                    <Link to={`/posts/add`}>
                        <i className="plus icon"></i>
                    </Link>
                </div>
            );
        }
        return (
            <div className="page-container">
                {this.state.posts.map((post) => (
                    post.display && (
                        <div className="item-box" key={post.id}>
                            <div className="photo">
                                <Link to={`/posts/${post.id}`}>
                                    <img src={post.avatarUrl} alt="myBlog"/>
                                </Link>
                            </div>
                            <div className="info-header">{post.title}</div>
                            <div className="info-detail">
                                {post.description}
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
