import React from "react";
import {post} from "./Http";

class UserRole extends React.Component {
    state = {
        roles: []
    }
    async componentDidMount() {
        const roles = [
            {name: 'ADMIN'},
            {name: 'USER'}
        ];
        const data = await fetch("/api/users/addRole", {
            method: "POST",
            body: JSON.stringify(roles[0]),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const data2 = await fetch("/api/users/addRole", {
            method: "POST",
            body: JSON.stringify(roles[1]),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const roleList = await data2.json();
        if(roleList) {
            this.setState({
                roles: roleList
            });
        }
    }

    render() {
        return (
            <div>
                {this.state.roles.map((role) => (
                    <div key={role.id}>
                        <div>Name: </div>
                        <div>{role.name}</div>
                    </div>
                ))}
            </div>
        );
    }
}

export default UserRole;