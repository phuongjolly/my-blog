
import {Redirect} from "react-router-dom";
import React from "react";
import "./MyProfile.css"
import {get, post} from "./Http";

class MyProfile extends React.Component {
    state = {
        name: '',
        email: '',
        avatarUrl: '',
        password: '',
        file: '',
        redirectToHome: false,
        message: ''
    }

    async componentDidMount(){
        try{
            const user = await get("/api/users/currentUser");
            this.setState({
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                password: user.password
            });
        }catch (exception) {
            console.log("can not see profile");
        }
    }

    onSelectedAvatar(e){
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        const ext = file['name'].substring(file['name'].lastIndexOf('.') + 1).toLowerCase();
        if(file && (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif')){
            reader.onload = () => {
                console.log("avatar url: " + reader.result);
                this.setState({
                    file: file,
                    avatarUrl: reader.result
                });
            }
        }

        reader.readAsDataURL(file);
    }

    onBackClick() {
        this.setState({
            redirectToHome: true
        });
    }

    async onSaveClick(){
        const user = {
            name: this.state.name,
            email: this.state.email,
            avatarUrl: this.state.avatarUrl
        }

        const response = await post("/api/users/update", user);
        if (response) {
            this.setState({
                redirectToHome: true,
                message: "Update successful"
            });
        }
    }

    render () {
        if(this.state.redirectToHome) {
            return <Redirect to={"/posts"}/>
        }
        return (
            <div className="myProfile">
                <div className="name">
                    <input type="text" value={this.state.name}
                           onChange={(event) => this.setState({name: event.target.value})}/>
                </div>
                <div className="email">{this.state.email}</div>
                <div className="password">
                    <input value={this.state.password}/>
                </div>
                <div className="avatar">
                    <input type="file" onChange={(event) => this.onSelectedAvatar(event)}/>
                    <img src={this.state.avatarUrl} alt="avatar" />
                </div>
                <div className="ui buttons">
                    <button className="ui button" onClick={() => this.onBackClick()}>Back</button>
                    <div className="or"></div>
                    <button className="ui positive button" onClick={() => this.onSaveClick()}>Save</button>
                </div>
            </div>
        );
    }
}

export default MyProfile;