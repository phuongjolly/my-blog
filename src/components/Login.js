import React from "react";
import {Redirect} from "react-router-dom";
import {get, post} from "./Http";
import store from "./stores/store";
import {login} from "./stores/authenticationReducer";

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        message: '',
        redirectToHome: false,
        redirectToRegister: false
    };

    async onLoginClick() {
        if(!this.state.email || !this.state.password) {
            return;
        }

        const user = {
            email: this.state.email,
            password: this.state.password
        };

        const response = await post("/api/users/login", user);

        if(response) {
            this.setState({
                message: "Login successful",
                redirectToHome: true
            });
        }

        try {
            const currentUser = await get("/api/users/currentUser");
            if (currentUser) {
                store.dispatch(login(currentUser));
            } else {
                console.log("can not fetch");
            }
        } catch (exception) {
            console.log("No logged in user.");
        }
    }

    render() {
        console.log(this.state.message);
        if(this.state.redirectToHome) {
            return <Redirect to={`/posts`} />;
        }

        if(this.state.redirectToRegister) {
            return <Redirect to={`/user/register`} />;
        }

        return (
            <div>
                <form className="ui form">
                    <div className="field">
                        <label>Email </label>
                        <input type="text" name="email" placeholder="Email"
                               onChange={(event) => this.setState({email: event.target.value})}
                               value={this.state.email}
                        />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Password"
                            onChange={(event) => this.setState({password: event.target.value})}
                            value={this.state.password}
                        />
                    </div>
                    <button className="ui button" type="button" onClick={() => this.onLoginClick()}>Login</button>
                    <button className="ui button" type="button" onClick={() => this.setState({redirectToRegister: true})}>Register</button>
                </form>
            </div>
        );
    }
}

export default Login;