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
        await post("/api/users/addRole", roles[0]);
        const roleList = await post("/api/users/addRole", roles[1]);
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