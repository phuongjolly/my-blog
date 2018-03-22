import {EditorState, RichUtils, Modifier} from "draft-js"
import getCurrentlySelectedBlock from "./getCurrentlySelectedBox";

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

export default ExtendedRichUtils;