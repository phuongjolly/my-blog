import React from "react"
import "draft-js/dist/Draft.css"
import "./PostEditor.css"
import {
    convertToRaw, convertFromRaw, Editor,
    EditorState, RichUtils, AtomicBlockUtils,
    CompositeDecorator, Entity
    } from "draft-js";
import ExtendedRichUtils, {ALIGNMENT_DATA_KEY} from "./plugins/ExtendedRichUtils";
import MyMediaEditor from "./MyMediaEditor";
import MyImageUpload from "./MyImageUpload";
import {Redirect} from "react-router-dom";
import {get, post} from "./Http"

class PostEditor extends React.Component {

    decorator = new CompositeDecorator([
        {
            strategy: findLinkEntities,
            component: Link,
        },
        ]);

    state = {
        editorState: EditorState.createEmpty(this.decorator),
        id: 0,
        title: '',
        description: '',
        avatarUrl: '',
        isSelectingMedia: false,
        urlType: '',
        message: undefined,
        redirectToPost: false,
        previousId: 0,
        newTag: '',
        tags: []
    };

    onChange = (editorState) => {
        this.setState({editorState});
    };

    focus = () => {
        this.editor.focus();
    };

    async componentDidMount(){
        this.focus();

        const {id} = this.props.match.params;
        if(id > 0) {
            const data = await get(`/api/posts/${id}`);
            console.log("data");
            if(data){
                this.setState({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    avatarUrl: data.avatarUrl,
                    editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)), this.decorator),
                    isSelectingMedia: false,
                    urlType: '',
                    previousId: data.id,
                    tags: data.tags
                });
            }
        } else {
            const data = await get(`/api/posts/latest`)
            const newId = (data + 1);
            this.setState({
                id: newId,
                title: '',
                description: '',
                avatarUrl: '',
                editorState: EditorState.createEmpty(this.decorator),
                isSelectingMedia: false,
                urlType: '',
                previousId: 0,
                tags: []
            });
        }
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
        let entityKey;
        if (urlType === 'LINK') {
            console.log("selected LINK" + url);
            entityKey = Entity.create(
                urlType,
                'MUTABLE',
                {url: url}
                );
            console.log("set state link" + entityKey.url);
        } else {
            entityKey = Entity.create(
                urlType,
                'IMMUTABLE',
                { src: url}
            );
        }

        if(urlType === 'LINK'){
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
        if(block.getType() === 'atomic'){
            return {
                component: Media,
                editable: false
            };
        }
        return null;
    }

    async onSaveClick() {
        let postObject = '';
        let tagsName = [];
        this.state.tags.map((tag) => (
            tagsName.push(tag.name)
        ));
        if(this.state.newTag !== '' && (!tagsName.includes(this.state.newTag) || this.state.tags.length <= 0)) {

            const tag = {name: this.state.newTag};
            postObject = {
                id: this.state.id,
                title: this.state.title,
                description: this.state.description,
                avatarUrl: this.state.avatarUrl,
                content: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
                likeCount: 0,
                commentCount: 0,
                previousId: 0,
                tags: [...this.state.tags, tag]
            };
        } else {
            postObject = {
                id: this.state.id,
                title: this.state.title,
                description: this.state.description,
                avatarUrl: this.state.avatarUrl,
                content: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
                likeCount: 0,
                commentCount: 0,
                previousId: 0,
                tags: this.state.tags
            };
        }

        console.log(postObject);

        const response = await post("/api/posts", postObject);

        if(response){

            this.setState({
                message: "Post editor !",
                redirectToPost: true
            });
        }

    }

    async onDiscardClick() {
        this.setState({
            editorState: EditorState.createEmpty(this.decorator),
            id: 0,
            title: '',
            description: '',
            avatarUrl: '',
            isSelectingMedia: false,
            urlType: '',
            message: undefined,
            redirectToPost: true
        });
    }

    selectedPostAvatar(url){
        this.setState({
            avatarUrl: url
        });
    }

    setNewTag(value){
        this.setState({newTag: value});
    }

    render() {

        const {editorState, avatarUrl} = this.state;
        let $avatarPreview = '';
        if(avatarUrl) {
            $avatarPreview = <img src={avatarUrl} alt="avatar"/>;
        } else {
            $avatarPreview = <img src="https://demokaliumsites-laborator.netdna-ssl.com/freelancer/wp-content/uploads/2015/03/8tracks_covers01_905-655x545.jpg" alt="avatar" />;
        }

        if (this.state.redirectToPost) {
            if (this.state.previousId > 0) {
                return (<Redirect to={`/posts/${this.state.previousId}`}/>);
            }
            else {
                return (<Redirect to={`/posts`}/>);
            }
        }

        return (
            <div className="editor-root">
                <div>
                    <div className="ui fluid input post-title">
                        <input type="text" placeholder="Title"
                               onChange={(event) => this.setState({title: event.target.value})}
                              value={this.state.title}
                        />
                    </div>
                    <div className="ui fluid input post-description">
                        <input type="text" placeholder="Description"
                               onChange={(event) => this.setState({description: event.target.value})}
                               value={this.state.description}
                        />
                    </div>
                </div>
                <div className="post-avatar">
                    <MyImageUpload selectedPostAvatar={(url) => this.selectedPostAvatar(url)}/>
                    {$avatarPreview}
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
                        <button className="ui button" onClick={() => this.setBlockStyling('block-quote')}>
                            <i className="quote left icon" />
                        </button>
                        <button className="ui button" onClick={() => this.setBlockStyling('code-block')}>
                            <i className="code icon" />
                        </button>
                        <button className="ui button" onClick={() => this.addLink()}>
                            <i className="linkify icon" />
                        </button>

                        <button className="ui button mediaButton" onClick={() => this.addImage()}>
                            <i className="image icon" />
                        </button>
                        <button className="ui button" onClick={() => this.setBlockStyling('header-two')}>
                            H2
                        </button>
                        <button className="ui button" onClick={() => this.setBlockStyling('header-three')}>
                            H3
                        </button>
                        <button className="ui button" onClick={() => this.setBlockStyling('header-four')}>
                            H4
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
                                customStyleMap={styleMap}
                                blockRendererFn={this.mediaBlockRenderer}
                                placeholder="Tell your story"
                                spellCheck
                            />
                        </div>
                    </div>
                </div>
                <div className="tags">
                    <div>Tags: </div>
                    {this.state.tags.map((tag) => (
                        <div key={tag.id}>{tag.name}</div>
                    ))}
                    <div className="ui input">
                        <input type="text" placeholder="Title"
                               onChange={(event) => this.setNewTag(event.target.value)}
                               value={this.state.newTag}
                        />
                    </div>
                </div>
                <div className="ui buttons">
                    <button className="ui button" onClick={() => this.onDiscardClick()}>Discard</button>
                    <div className="or"></div>
                    <button className="ui positive button" onClick={() => this.onSaveClick()}>Save</button>
                </div>

            </div>
        );
    }
}

const Image = (props) => {
    return <img src={props.src} alt="content"/>
};

const Media = (props) => {
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

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 14,
        padding: 2,
    },
};

export default PostEditor;