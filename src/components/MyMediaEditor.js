import React from "react";
import "./PostEditor.css"
import {Modal} from 'semantic-ui-react'

class MyMediaEditor extends React.Component {
    state = {
        value: ''
    }

    render() {
        return (
            <Modal open>
                <Modal.Content image>
                    <div>
                        <input type="text" ref="url"
                               onChange={(event) => this.setState({value: event.target.value})}
                               value={this.state.value} />
                        <button
                            className="positive ui button confirmMedia"
                            onClick={() => this.props.selectedMediaUrl(this.state.value)}>
                            Confirm
                        </button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }
}

export default MyMediaEditor;


