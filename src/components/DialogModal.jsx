import React from 'react';
import PropTypes from 'prop-types';

const backdropStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: 50,
};

const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: 5,
  maxWidth: 500,
  minHeight: 300,
  margin: '0 auto',
  padding: 30,
};

export default function DialogModal({ show, onClose, message }) {
  if (!show) {
    return null;
  }

  return (
    <div className="backdrop" style={backdropStyle}>
      <div className="modal" style={modalStyle}>
        {message}

        <div className="footer">
          <button onClick={onClose}>
                            Close
          </button>
        </div>
      </div>
    </div>
  );
}

DialogModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  message: PropTypes.string,
};

DialogModal.defaultProps = {
  show: false,
  message: '',
};

