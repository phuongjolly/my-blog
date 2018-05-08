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
        redirectToHome: false,
        loading: false

    };

    async onRegisterClick(event) {
        event.preventDefault();

        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        };

        this.setState({loading: true});

        try{
            await post("/api/users/register", user);

            //if(response){
            this.setState({
                message: "Register successful",
                redirectToLogin: true,
                loading: false
            });
            //}
        } catch (e) {
            this.setState({
                message: e.message,
                loading: false
            })
        }

    }
    render () {

        if(this.state.redirectToLogin) {
            return (<Redirect to={`/user/login`} />);
        }
        return (
            <div className="authForm">
                <h3 className="errorMessage">{this.state.message}</h3>
                <form className="ui form" onSubmit={(event) => {this.onRegisterClick(event); return false;}}>
                    <div className="field">
                        <label>First Name</label>
                        <input required type="text" name="first-name" placeholder="First Name"
                                onChange={(event) => this.setState({name: event.target.value})}
                                value={this.state.name} />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input type="email" required type="text" name="email" placeholder="Email"
                               onChange={(event) => this.setState({email: event.target.value})}
                               value={this.state.email} />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input required type="password" name="password" placeholder="Password"
                               onChange={(event) => this.setState({password: event.target.value})}
                               value={this.state.password}/>
                    </div>
                    <div className="formButton">
                        <button className={this.state.loading ? "ui loading button" : "ui button"} type="submit">Register</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Register;

