import React from "react"
import "draft-js/dist/Draft.css"
import {Editor, EditorState, RichUtils, Modifier} from "draft-js"


import "./Post.css"
import getCurrentlySelectedBlock from "./plugins/getCurrentlySelectedBox";

export const ALIGNMENT_DATA_KEY = 'textAlignment';

const ExtendedRichUtils = Object.assign({}, RichUtils, {
    toggleAlignment(editorState, alignment) {
        const {content, currentBlock, hasAtomicBlock, target} = getCurrentlySelectedBlock(editorState);

        if (hasAtomicBlock) {
            return editorState;
        }

        const blockData = currentBlock.getData();
        const alignmentToSet = blockData
            && blockData.get(ALIGNMENT_DATA_KEY) === alignment ? undefined : alignment;

        return EditorState.push(
            editorState,
            Modifier.mergeBlockData(content, target, {
                [ALIGNMENT_DATA_KEY]: alignmentToSet
            }),
            'change-block-data'
        );

    }
});


class Post extends React.Component {

    constructor(props){
        super(props);
        this.state = {editorState: EditorState.createEmpty() };

    }

    onChange = (editorState) => {
        this.setState({editorState});
    };

    focus = () => {
        this.editor.focus();
    };

    componentDidMount(){
        this.focus();
    }

    handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if(newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not handled';
    };



    onKeyStylingClick(style) {
         this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style));

    }

    setAlignment(alignment) {
        const newEditorState = ExtendedRichUtils.toggleAlignment(this.state.editorState, alignment);
        this.setState({editorState: newEditorState} );
    }


    blockStyleFn = (contentBlock) => {
        const textAlignStyle = contentBlock.getData().get(ALIGNMENT_DATA_KEY);
        switch (textAlignStyle) {
            case 'RIGHT':
                return 'align-right';
            case 'CENTER':
                return 'align-center';
            case 'LEFT':
                return 'align-left';
            case 'JUSTIFY':
                return 'align-justify';
            default:
                return '';
        }
    };

    render() {
        const {editorState} = this.state;
        return (
            <div>
                <div className="ui icon buttons">
                    <button className="ui button" onClick={() => this.setAlignment('LEFT')}>
                        <i className="align left icon" />
                    </button>
                    <button className="ui button" onClick={() => this.setAlignment('CENTER')}>
                        <i className="align center icon" />
                    </button>
                    <button className="ui button" onClick={() => this.setAlignment('RIGHT')}>
                        <i className="align right icon" />
                    </button>
                    <button className="ui button" onClick={() => this.setAlignment('JUSTIFY')}>
                        <i className="align justify icon" /></button>
                    <button className="ui button" onClick={() => this.onKeyStylingClick('BOLD')}>
                        <i className="bold icon" /></button>
                    <button className="ui button" onClick={() => this.onKeyStylingClick('UNDERLINE')}>
                        <i className="underline icon" />
                    </button>
                    <button className="ui button" onClick={() => this.onKeyStylingClick('LINE-THROUGH')}>
                        <i className="text width icon" />
                    </button>
                </div>
                <div className="editor" onClick={this.focus}>
                    <Editor
                        editorState={editorState}
                        onChange={this.onChange}
                        handleKeyCommand={this.handleKeyCommand}
                        ref={(element) => {this.editor = element;}}
                        blockStyleFn={this.blockStyleFn}
                        placeholder="Tell your story"
                        spellCheck
                    />
                </div>
            </div>
        );
    }
}

export default Post;