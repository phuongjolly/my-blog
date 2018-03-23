import {convertFromRaw} from "draft-js";
import {stateToHTML} from 'draft-js-export-html';
import React from "react";
import ReactHtmlParser from 'react-html-parser'

class Post extends React.Component {
    state = {
        id: 0,
        title: '',
        description: '',
        content: '',
        avatarUrl: ''
    }

    async componentDidMount(){
        const {id} = this.props.match.params;
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        const content = stateToHTML(convertFromRaw(JSON.parse(data.content)));
        if(data){
            this.setState({
                id: data.id,
                title: data.title,
                description: data.description,
                avatarUrl: data.avatarUrl,
                content: content
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

    render(){
        const elementHTML = ReactHtmlParser(this.state.content);

        return (
            <div>
                <div>{this.state.title}</div>
                <div>{this.state.description}</div>
                {elementHTML}
            </div>
        );
    }
}

export default Post;