import React from "react";

class MyImageUpload extends React.Component {
    state = {
        file: '',
        imagePreviewUrl: ''
    };

    onImageChange(e){
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        const ext = file['name'].substring(file['name'].lastIndexOf('.') + 1).toLowerCase();
        if(file && (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif')){
            reader.onload = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result
                });
                this.props.selectedPostAvatar(this.state.imagePreviewUrl);
            }
        }

        reader.readAsDataURL(file);
    }

    render(){
        return (
            <div>
                <input type="file" onChange={(e) => this.onImageChange(e)} />
            </div>
        );
    }
}

export default MyImageUpload;