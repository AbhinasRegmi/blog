import { createContext } from 'react';
import { BlockAction } from './editorReducer';


interface EditorContexInterface {
    dispatch: ((I: BlockAction) => void) | null
}

export const editorContext = createContext<EditorContexInterface>({dispatch: null})
