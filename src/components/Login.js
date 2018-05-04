import React from "react";
import {Redirect} from "react-router-dom";
import {get, post} from "./Http";
import store from "./stores/store";
import {login} from "./stores/authenticationReducer";
import Error403 from "./Error403";
import {RingLoader} from "react-spinners"
import "./Authentication.css"

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        message: '',
        redirectToRegister: false,
        redirectToError403: false,
        redirectToError404: false,
        redirectToPreviousPage: false,
        loading: false
    };


    async onLoginClick() {
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

        const response = await post("/api/users/login", user);

        if(response) {
            if(response.status === 403) {
                this.setState({
                    massage: "Login failed",
                    redirectToError403: true
                });
            } else if(response.status === 404) {
                this.setState({
                    massage: "Login failed",
                    redirectToError404: true
                });
            } else {
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
            }
        }

    }

    render() {
        console.log(this.state.message);
        let $error403 = '';

        if(this.state.redirectToPreviousPage) {
            if(this.props.history.location.state){
                const previousState = this.props.history.location.state.currentState;
                return <Redirect to={previousState}/>
            } else {
                return <Redirect to={'/posts'}/>
            }


        } else if(this.state.redirectToRegister) {

            return <Redirect to={`/user/register`} />;

        } else if(this.state.redirectToError403) {

            $error403 = <Error403/>;

        } else if(this.state.redirectToError404) {

            return <Redirect to={`/Error404`}/>;

        }

        return (

            <div className="authForm">
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
                    <div className="formButton">
                        <button className={this.state.loading ? "ui loading button" : "ui button"} type="button" onClick={() => this.onLoginClick()}>Login</button>
                        <button className="ui button" type="button" onClick={() => this.setState({redirectToRegister: true})}>Register</button>
                    </div>
                </form>
                {$error403}
            </div>
        );
    }
}

export default Login;