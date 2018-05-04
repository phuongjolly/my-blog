import React from "react";
import {Link} from "react-router-dom";
import {get} from './Http'
import "./Tag.css"

class Tags extends React.Component{
    state = {
        posts: []
    }

    async componentDidMount() {
        const {name} = this.props.match.params;
        const posts = await get(`/api/posts/tags/${name}`);
        if(posts) {
            this.setState({posts});
        }

    }

    render() {
        return (
            <div className="tag">
                <div className="title">{`List of Posts related to ${this.props.match.params.name}: `}</div>
                {this.state.posts.map((post, index) => (
                    <div key={post.id}>
                        <Link to={`/posts/${post.id}`}>
                            <div className="item">{`${index}. ${post.title}`}</div>
                        </Link>
                    </div>
                ))}
            </div>
        );
    }
}

export default Tags;