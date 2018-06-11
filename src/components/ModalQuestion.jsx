import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import './ModalQuesion.css';

const messageTitle = 'Your inbox is getting full, ' +
  'would you like us to enable automatic archiving of old messages?';
export default function ModalQuestion({ doTask, closeModal, isActive }) {
  return (
    <Modal
      basic
      onClose={() => closeModal()}
      open={isActive}
      className="modalQuestion"
    >
      <Header icon="archive" content="Archive Post" />
      <Modal.Content>
        <p>
          {messageTitle}
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="red"
          basic
          inverted
          onClick={() => closeModal()}
        >
          <Icon name="remove" />
            No
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => { closeModal(); doTask(); }}
        >
          <Icon name="checkmark" />
            Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

ModalQuestion.propTypes = {
  doTask: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

ModalQuestion.defaultProps = {
  isActive: false,
};
