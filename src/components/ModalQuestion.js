import React from "react";
import {Button, Header, Icon, Modal} from "semantic-ui-react";
import "./ModalQuesion.css"

class ModalQuestion extends React.Component{
    state = {
        active: true
    }

    onCloseModal() {
        console.log("Are you here");
        this.setState({
            active: false
        });
    }

    render() {
        return (
            <Modal basic onClose={() => this.onCloseModal()} open={this.state.active} className="modalQuestion">
                <Header icon='archive' content='Archive Post' />
                <Modal.Content>
                    <p>Your inbox is getting full, would you like us to enable automatic archiving of old messages?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="red"
                            basic
                            inverted
                            onClick={() => this.onCloseModal()}
                    >
                        <Icon name="remove"/>
                        No
                    </Button>
                    <Button color="green"
                            inverted
                            onClick={() => {this.props.deletePost(); this.onCloseModal()}}
                    >
                        <Icon name="checkmark"/>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ModalQuestion;