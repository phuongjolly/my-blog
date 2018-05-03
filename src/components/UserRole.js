import React from "react";

class UserRole extends React.Component {
    state = {
        roles: [],
        roleName: '',
        displayButton: true
    }

    async setRole() {
        const role = {name: this.state.roleName};
        const data = await fetch("/api/users/addRole", {
            method: "POST",
            body: JSON.stringify(role),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const roleList = await data.json();
        if(roleList) {
            this.setState({
                roles: roleList
            });
        }
    }

    async onChangeButton(value) {
        this.setState({roleName: value});
    }


    render() {
        let roleList;
        if(!this.state.displayButton) {
            roleList =
                (<div>
                {this.state.roles.map((role) => (
                    <div key={role.id}>
                        <div>Name: </div>
                        <div>{role.name}</div>
                    </div>
                ))}
                </div>);
        }
        return (
            <div>

                <input type="text" onChange={(event) => this.onChangeButton(event.target.value)}
                    value={this.state.roleName}
                />
                <button type="button" onClick={() => this.setRole()}>Set Role</button>

                <div>
                    {this.state.roles.map((role) => (
                        <div key={role.id}>
                            <div>Name: </div>
                            <div>{role.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default UserRole;