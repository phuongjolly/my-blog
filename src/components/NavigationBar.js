import React from "react";
import "./NavigationBar.css";

class NavigationBar extends React.Component {

    render() {
        return (
            <div className="navigation-bar">
                <div className="branch">
                    Phuong Blogs
                </div>
                <a className="item" href="#home">
                    Home
                </a>
            </div>
        )
    }
}

export default NavigationBar;