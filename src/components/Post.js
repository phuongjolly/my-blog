import React from "react"
import "draft-js/dist/Draft.css"
import {convertToRaw, Editor, EditorState, RichUtils, AtomicBlockUtils, CompositeDecorator, Entity} from "draft-js"
import "./Post.css"
import ExtendedRichUtils, {ALIGNMENT_DATA_KEY} from "./plugins/ExtendedRichUtils";
import MyMediaEditor from "./MyMediaEditor";

class Post extends React.Component {

    decorator = new CompositeDecorator([
        {
            strategy: findLinkEntities,
            component: Link,
        },
        ]);

    state = {
        editorState: EditorState.createEmpty(this.decorator),
        title: '',
        description: '',
        isSelectingMedia: false,
        urlType: '',
        message: undefined
    };

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

    setBlockStyling(type) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, type));
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

    addImage(){
        this.promptForMedia('image');
    }

    addLink(){
        const {editorState} = this.state;
        const selection = editorState.getSelection();
        if(!selection.isCollapsed()) {
            this.promptForMedia('LINK');
        }
    }

    promptForMedia(type){
        this.setState({
            isSelectingMedia: true,
            urlType: type,
        });
    }

    selectedMediaUrl(url) {
        const {editorState, urlType} = this.state;

        console.log("HELLO" + url);

        let entityKey;

        if (urlType === 'LINK') {
            entityKey = Entity.create(
                urlType,
                'MUTABLE',
                {url: url}
            );
        } else {
            entityKey = Entity.create(
                urlType,
                'IMMUTABLE',
                { src: url}
            );
        }


        if(urlType === 'LINK'){
            console.log("is link");
            this.setState({
                editorState: RichUtils.toggleLink(
                    editorState,
                    editorState.getSelection(),
                    entityKey
                ),
                isSelectingMedia: false,
                urlType: ''
            });
        } else {
            this.setState({
                editorState: AtomicBlockUtils.insertAtomicBlock(
                    editorState,
                    entityKey,
                    ' '
                ),
                isSelectingMedia: false,
                urlType: ''
            });
        }

    }



    mediaBlockRenderer(block){
        console.log("type = " + block.getType());
        if(block.getType() === 'atomic'){
            return {
                component: Media,
                editable: false
            };
        }
        return null;
    }

    async onSaveClick(){
        const post = {
            title: JSON.stringify(this.state.title),
            description: JSON.stringify(this.state.description),
            content: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
            likeCount: 0,
            commentCount: 0
        };

        const response = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify(post),
            headers: {
                "Content-Type": "application/json"
            }
        });

        this.setState({
            message: "Saved!"
        });
    }

    render() {
        const {editorState} = this.state;

        return (
            <div className="editor-root">
                <div>
                    <div class="ui fluid input post-title">
                        <input type="text" placeholder="Title"
                               onChange={(event) => this.setState({title: event.target.value})}
                              value={this.state.title}
                        />
                    </div>
                    <div class="ui fluid input post-description">
                        <input type="text" placeholder="Description"
                               onChange={(event) => this.setState({description: event.target.value})}
                               value={this.state.description}
                        />
                    </div>
                </div>
                <div className="ui segment">
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
                            <i className="align justify icon" />
                        </button>
                        <button className="ui button" onClick={() => this.onKeyStylingClick('BOLD')}>
                            <i className="bold icon" />
                        </button>
                        <button className="ui button" onClick={() => this.onKeyStylingClick('UNDERLINE')}>
                            <i className="underline icon" />
                        </button>
                        <button className="ui button" onClick={() => this.onKeyStylingClick('LINE-THROUGH')}>
                            <i className="text width icon" />
                        </button>
                        <button className="ui button" onClick={() => this.setBlockStyling('blockquote')}>
                            <i className="quote left icon" />
                        </button>
                        <button className="ui button" onClick={() => this.addLink()}>
                            <i className="linkify icon" />
                        </button>

                        <button className="ui button mediaButton" onClick={() => this.addImage()}>
                            <i className="image icon" />
                        </button>
                        <button className="ui button" onClick={() => this.setBlockStyling('header-two')}>
                            H1
                        </button>
                        <button className="ui button" onClick={() => this.setBlockStyling('header-five')}>
                            H5
                        </button>
                    </div>
                    <div className="editor-content">
                        {
                            this.state.isSelectingMedia &&
                            <MyMediaEditor selectedMediaUrl={(value) => this.selectedMediaUrl(value)} />
                        }
                        <div className="editor" onClick={this.focus}>
                            <Editor
                                editorState={editorState}
                                onChange={this.onChange}
                                handleKeyCommand={this.handleKeyCommand}
                                ref={(element) => {this.editor = element;}}
                                blockStyleFn={this.blockStyleFn}
                                blockRendererFn={this.mediaBlockRenderer}
                                placeholder="Tell your story"
                                spellCheck
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button className="ui primary button" onClick={() => this.onSaveClick()}>
                        Save
                    </button>
                    <button className="ui button">
                        Discard
                    </button>
                </div>
            </div>
        );
    }
}

const Image = (props) => {
    return <img src={props.src} />
};

const Media = (props) => {
    console.log(props);
    const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    );
    const {src} = entity.getData();
    const type = entity.getType();

    let media;
    if(type === 'image'){
        media = <Image src={src}/>
    }

    return media;
};

function findLinkEntities(contentBlock, callback) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (entityKey != null && Entity.get(entityKey).getType() === 'LINK');
        },
        callback
    );
}

const Link = (props) => {
    const {url} = Entity.get(props.entityKey).getData();
    console.log("url here: " + {url}.url);
    return (
        <a href={url} className="editorLink">
            {props.children}</a>
    );
};


export default Post;