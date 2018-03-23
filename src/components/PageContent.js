import React from "react"
import "./PageContent.css"
import {Link} from "react-router-dom";

class PageContent extends React.Component {
    state = {
        posts: []
    };

    async componentDidMount() {
        const response = await fetch("/api/posts");
        const posts = await response.json();
        this.setState({posts});
    }
    render () {
        return (
            <div className="page-container">
                {this.state.posts.map((post) => (
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
                ))}
            </div>

        );
    }
}

export default PageContent;
