import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './PostEditor.css';

class MyMediaEditor extends React.Component {
    state = {
      value: '',
    }

    render() {
      return (
        <Modal open>
          <Modal.Content image>
            <div>
              <input
                type="text"
                onChange={event => this.setState({ value: event.target.value })}
                value={this.state.value}
              />
              <button
                className="positive ui button confirmMedia"
                onClick={() => this.props.selectedMediaUrl(this.state.value)}
              >
                            Confirm
              </button>
            </div>
          </Modal.Content>
        </Modal>
      );
    }
}

export default MyMediaEditor;

MyMediaEditor.propTypes = {
  selectedMediaUrl: PropTypes.func.isRequired,
};
