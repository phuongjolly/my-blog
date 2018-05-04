import React from "react";
import {Redirect} from "react-router-dom";
import {post} from "./Http";

class Register extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        role: '',
        message: '',
        redirectToHome: false

    };

    async onRegisterClick() {
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        };

        const response = await post("/api/users/register", user);

        if(response){
            this.setState({
                message: "Register successful",
                redirectToLogin: true
            })
        }
    }
    render () {
        if(this.state.message) {
            console.log(this.state.message);
        }

        if(this.state.redirectToLogin) {
            return (<Redirect to={`/user/login`} />);
        }
        return (

            <div className="authForm">
                <form className="ui form">
                    <div className="field">
                        <label>First Name</label>
                        <input type="text" name="first-name" placeholder="First Name"
                                onChange={(event) => this.setState({name: event.target.value})}
                                value={this.state.name} />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input type="text" name="email" placeholder="Email"
                               onChange={(event) => this.setState({email: event.target.value})}
                               value={this.state.email} />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Password"
                               onChange={(event) => this.setState({password: event.target.value})}
                               value={this.state.password}/>
                    </div>
                    <div className="formButton">
                        <button className="ui button" type="button" onClick={() => this.onRegisterClick()}>Register</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Register;