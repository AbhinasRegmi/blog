import { UIBlocks, BlockType } from "@/components/ui/editorBlocks";

export type ActionType = 'create' | 'update' | 'delete' | 'escape';
export type ActionPayloadType = {
    type: ActionType;
    key?: string;
    value?: string;
    uitype?: UIBlocks;
}



export function editorReducer(state: Array<BlockType>, action: ActionPayloadType): Array<BlockType> {
    
    switch (action.type) {
        case('create'): {
            let identifier = crypto.randomUUID();

            if(action.uitype){
                return [
                    ...state,
                    {
                        key: identifier,
                        type: action.uitype,
                        value: ''
                    }
                ]
            }else{
                throw new Error('UiType is required for create action.')
            }
        }
        case('update'): {
            if(action.key){

                return state.map(block => {
                    if(block.key === action.key){
                        return {
                            ...block,
                            value: action.value ?? ''
                        }
                    }else{
                        return block
                    }
                })
            }else{
                throw new Error('Ui key and value is required for update action.')
            }
        }
        case('delete'):{
            if(action.key){
                return state.filter(block => block.key !== action.key);
            }else{
                throw new Error('Key is required for delete action.')
            }
        }
        case ('escape'): {
            return state;
        }
        default: {
            throw new Error(`Unknown Action Type: ${action.type}`)
        }
    }
}
