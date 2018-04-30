import React from "react"
import {Link} from "react-router-dom";
import {post} from "./Http";
import {logout} from "./stores/authenticationReducer";
import {connect} from "react-redux";
import {withRouter} from "react-router";

class Header extends React.Component {

    state = {
        redirectToHome: false,
    };

    async onLogoutClick() {
        post("/api/users/logout");
        this.props.logout();
        this.setState({
            redirectToHome: true
        });
    }

    render() {
        if(this.state.redirectToHome) {
            window.location.replace('/posts');
        }

        let helloMessage;
        let loginButton;
        if(this.props.currentUser){
            helloMessage = (
                <div className="hello-message">
                    <div className="hello"> Hello </div>
                    <div className="username">{this.props.currentUser.name}</div>
                    <button className="ui button helloButton" onClick={() => this.onLogoutClick()}>Logout</button>
                </div>
            );
        } else {
            loginButton = (
                <div className="hello-message">
                    <Link to={{
                        pathname: '/user/login',
                        state: {currentState: this.props.match.url}
                    }} className="ui link login-button">
                        Login
                    </Link>
                    <Link to={`/user/register`} className="ui link register-button">
                        Register
                    </Link>
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

                    {helloMessage}
                    {loginButton}
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
                        <Link to={'/posts/4'}>
                            <div className="item">About</div>
                        </Link>
                    </div>
                </div>
            </div>

        );
    }
}

export default withRouter(connect(
    (state) => state.authentication,
    { logout }
)(Header));