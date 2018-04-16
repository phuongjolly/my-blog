import React from "react"
import {Link} from "react-router-dom";
import {get} from "./Http";
import {logout} from "./stores/authenticationReducer";
import {connect} from "react-redux";
import store from "./stores/store"

class Header extends React.Component {

    async onLogoutClick() {
        await fetch("/api/users/logout", {credentials: 'include'});
        this.props.logout();
    }

    render() {
        let $helloMessage;
        if(this.props.currentUser){
            $helloMessage = (
                <div>
                    <h2>Hello </h2>
                    <h1>{this.props.currentUser.name}</h1>
                    <button className="ui button" onClick={() => this.onLogoutClick()}>Logout</button>
                </div>
            );
        }
        return (
            <div className="">
                <div className="main-header">
                    <div className="header-logo">
                        <img
                            src="https://demokaliumsites-laborator.netdna-ssl.com/freelancer/wp-content/uploads/2015/03/dp.png"
                            alt="logo"/>
                    </div>
                    <div className="menu-column">
                        {$helloMessage}
                    </div>
                </div>
                <div className="portfolio-container">
                    <div className="portfolio-title-holder">
                        <div className="portfolio-title">Portfolio</div>
                        <div className="portfolio-content">My all projects will be presented here</div>
                    </div>
                    <div className="portfolio-menu">
                        <div className="item">
                            <Link to={'/'}>
                                Home
                            </Link>
                        </div>
                        <div className="item">Project</div>
                        <div className="item">Articles</div>
                        <div className="item">About</div>
                    </div>
                </div>
            </div>

        );
    }
}

export default connect(
    (state) => state.authentication,
    { logout }
)(Header);