import React from "react";

class Tags extends React.Component{
    componentDidMount() {
        //const tagName = this.props.match.params.name;
        console.log(this.props.match);
    }

    render() {
        return (
            <div>Hello Tags</div>
        );
    }
}

export default Tags;