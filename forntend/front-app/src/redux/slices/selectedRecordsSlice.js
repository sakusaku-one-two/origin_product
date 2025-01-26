import { createSlice } from "@reduxjs/toolkit";
var initialSelectedRecordsState = {
    selectedRecords: null,
    isSelected: false
};
export var selectedRecordsSlice = createSlice({
    name: "SELECTED_RECORDS",
    initialState: initialSelectedRecordsState,
    reducers: {
        SET_SELECTED_RECORDS: function (state, action) {
            state.selectedRecords = action.payload;
            state.isSelected = action.payload !== null;
        }
    }
});
export var SET_SELECTED_RECORDS = selectedRecordsSlice.actions.SET_SELECTED_RECORDS;
export default selectedRecordsSlice.reducer;
