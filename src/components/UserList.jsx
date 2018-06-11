import React from "react";
import {post, get} from "./Http";
import "./UserList.css"

class UserList extends React.Component{
    state = {
        users: []
    }

    async componentDidMount() {
        const users = await get("/api/users");
        console.log("user roles ");

        if(users) {
            this.setState({users});
        }

    }

    async onSetAdmin(user)
    {
        const data = await post("/api/users/setAdmin", { email: user.email });
        if(data) {
            console.log("it seems setting admin successful");
            this.setState({
                users: this.state.users.map((user) => (
                    user.id === data.id ? {...user, admin: true} : user
                ))
            });
        }
    }


    render() {
        return (
            <div className="userList">
                <div className="tableRow header">
                    <div className="item">Username</div>
                    <div className="item">Email</div>
                    <div className="item">Action</div>
                </div>
                {this.state.users.map((user) =>
                    (
                            <div className="tableRow" key={user.id}>
                                <div className="item">{user.name}</div>
                                <div className="item">{user.email}</div>
                                {!user.admin ? (
                                    <button className="ui button item" onClick={() => this.onSetAdmin(user)}>
                                        Set Admin
                                    </button>
                                ) : (<div className="item">Admin</div>)
                                }
                            </div>
                    )
                )}
            </div>
        );
    }
}

export default UserList;