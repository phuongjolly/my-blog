import React from "react"
import "./PageContent.css"
import itemdemo1 from "../Resources/images/item-demo1.jpg";
import itemdemo2 from "../Resources/images/item-demo2.jpg";
import itemdemo3 from "../Resources/images/item-demo3.jpg";
import {Link} from "react-router-dom";

const images = [itemdemo1, itemdemo2, itemdemo3];

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
                {this.state.posts.map((post, index) => (
                    <div className="item-box" key={post.id}>
                        <div className="photo">
                            <Link to={`/posts/${post.id}`}>
                                <img src={images[index % 3]} alt="myBlog"/>
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
