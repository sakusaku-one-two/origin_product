import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { TimeRecordWithOtherRecord } from "../../hooks";

//----------------------------[型]----------------------------------------  
//この型は、選択されたレコードの型です。
type SelectedRecordsState = {
    selectedRecords:TimeRecordWithOtherRecord | null
    isSelected:boolean
};


const initialSelectedRecordsState:SelectedRecordsState = {
    selectedRecords:null,
    isSelected:false
};

export const selectedRecordsSlice = createSlice({
    name:"SELECTED_RECORDS",
    initialState:initialSelectedRecordsState,
    reducers:{
        SET_SELECTED_RECORDS:(state,action:PayloadAction<TimeRecordWithOtherRecord | null>)=>{
            state.selectedRecords = action.payload;
            state.isSelected = action.payload !== null;
        }
    }
});

export const {SET_SELECTED_RECORDS} = selectedRecordsSlice.actions;
export default selectedRecordsSlice.reducer;
