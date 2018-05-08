import React from "react";
import {Redirect} from "react-router-dom";
import {get, post} from "./Http";
import store from "./stores/store";
import {login} from "./stores/authenticationReducer";
import "./Authentication.css"

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        message: '',
        redirectToRegister: false,
        redirectToPreviousPage: false,
        loading: false
    };


    async onLoginClick(event) {
        event.preventDefault();
        if(!this.state.email || !this.state.password) {
            return;
        }

        const user = {
            email: this.state.email,
            password: this.state.password
        };

        this.setState({
            loading: true
        });

        try {
            const response = await post("/api/users/login", user);
            console.log("=====");
            console.log(response);

            this.setState({
                message: "Login successful",
                redirectToPreviousPage: true,
                loading: false
            });
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

        } catch (error) {
            this.setState({
                message: error.message,
                loading: false
            });
        }
    }

    render() {

        if(this.state.redirectToPreviousPage) {
            if(this.props.history.location.state){
                const previousState = this.props.history.location.state.currentState;
                return <Redirect to={previousState}/>
            } else {
                return <Redirect to={'/posts'}/>
            }


        } else if(this.state.redirectToRegister) {
            return <Redirect to={`/user/register`} />;

        }

        return (
            <div className="authForm">
                <h3 className="errorMessage">{this.state.message}</h3>
                <form className="ui form" onSubmit={(event) => { this.onLoginClick(event); return false;}}>
                    <div className="field">
                        <label>Email </label>
                        <input type="email" required name="email" placeholder="Email"
                               onChange={(event) => this.setState({email: event.target.value})}
                               value={this.state.email}
                        />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" required name="password" placeholder="Password"
                            onChange={(event) => this.setState({password: event.target.value})}
                            value={this.state.password}
                        />
                    </div>
                    <div className="formButton">
                        <button className={this.state.loading ? "ui loading button" : "ui button"} type="submit">Login</button>
                        <button className="ui button" type="button" onClick={() => this.setState({redirectToRegister: true})}>Register</button>
                    </div>
                </form>

            </div>
        );
    }
}

export default Login;