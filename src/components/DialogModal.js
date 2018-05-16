import React from "react";

class DialogModal extends React.Component {
    backdropStyle = {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 50
    };

    modalStyle = {
        backgroundColor: '#fff',
        borderRadius: 5,
        maxWidth: 500,
        minHeight: 300,
        margin: '0 auto',
        padding: 30
    };

    render() {
        if(!this.props.show) {
            return null;
        }

        return (
            <div className="backdrop" style={this.backdropStyle}>
                <div className="modal" style={this.modalStyle}>
                    {this.props.children}

                    <div className="footer">
                        <button onClick={this.props.onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DialogModal;

