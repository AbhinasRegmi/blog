import { createContext } from 'react';
import { ActionPayloadType } from './editorReducer';


interface EditorContexInterface {
    dispatch: ((I: ActionPayloadType) => void) | null
}

export const editorContext = createContext<EditorContexInterface>({dispatch: null})
