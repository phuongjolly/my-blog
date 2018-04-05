import React from "react"
import {Link} from "react-router-dom";
import {get} from "./Http";
import store from "./stores/store";
import {LOGOUT_ACTION} from "./stores/authenticationReducer";

class Header extends React.Component {

    state = {
        currentUserName: '',
    };

    async componentDidMount(){
        store.subscribe(() => {
            const {currentUser} = store.getState().authentication;
            if (currentUser) {
                this.setState({currentUserName: currentUser.name});
            } else {
                this.setState({currentUserName: null});
            }
        });
    }

    async onLogoutClick() {
        await get("/api/users/logout");
        store.dispatch({
            type: LOGOUT_ACTION
        })
    }

    render() {
        let $helloMessage;
        console.log("current user name: " + this.state.currentUserName);
        if(this.state.currentUserName){
            $helloMessage = (
                <div>
                    <h2>Hello </h2>
                    <h1>{this.state.currentUserName}</h1>
                    <button className="ui button" onClick={() => this.onLogoutClick()}>Logout</button>
                </div>);
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

export default Header;