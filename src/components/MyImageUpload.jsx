import React from 'react';
import PropTypes from 'prop-types';

class MyImageUpload extends React.Component {
    state = {
      imagePreviewUrl: '',
    };

    onImageChange(e) {
      e.preventDefault();
      const reader = new window.FileReader();
      const file = e.target.files[0];
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      if (file && (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif')) {
        reader.onload = () => {
          this.setState({
            imagePreviewUrl: reader.result,
          });
          this.props.selectedPostAvatar(this.state.imagePreviewUrl);
        };
      }

      reader.readAsDataURL(file);
    }

    render() {
      return (
        <input type="file" onChange={e => this.onImageChange(e)} />
      );
    }
}

export default MyImageUpload;

MyImageUpload.propTypes = {
  selectedPostAvatar: PropTypes.func.isRequired,
};
