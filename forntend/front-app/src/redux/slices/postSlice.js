var _a;
import { createSlice } from "@reduxjs/toolkit";
import { UPDATE as ATTENDANCE_RECORD_UPDATE, INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP } from "./attendanceSlice";
//----------------------------[初期値]----------------------------------------
export var initialPostState = {
    isLoading: false,
    postList: [],
};
//----------------------------[更新]----------------------------------------
var UpdatePostList = function (oldPostList, newPostRecords) {
    if (oldPostList.length === 0)
        return newPostRecords;
    if (newPostRecords.length === 0)
        return oldPostList;
    var ReplacedRecord = newPostRecords.map(function (newPostRecord) {
        var targetRecord = oldPostList.find(function (postRecord) { return postRecord.PostID === newPostRecord.PostID; });
        if (targetRecord) {
            return newPostRecord;
        }
        return targetRecord;
    });
    return ReplacedRecord;
};
//----------------------------[createSlice]----------------------------------------
var postSlice = createSlice({
    name: "POST_RECORD",
    initialState: initialPostState,
    reducers: {
        UPDATE: function (state, action) {
            state.postList = UpdatePostList(state.postList, [action.payload]);
            state.isLoading = false;
        },
        DELETE: function (state, action) {
            state.postList = state.postList.filter(function (postRecord) { return postRecord.PostID !== action.payload.PostID; });
        },
        INSERT_SETUP: function (state, action) {
            state.postList.push(action.payload);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(ATTENDANCE_RECORD_INSERT_SETUP, function (state, action) {
            var attendanceRecords = action.payload;
            var PostsList = attendanceRecords.map(function (attendanceRecord) {
                return attendanceRecord.Post;
            });
            state.postList = UpdatePostList(state.postList, PostsList);
        })
            .addCase(ATTENDANCE_RECORD_UPDATE, function (state, action) {
            var targetPostRecord = action.payload.Post;
            var targetIndex = state.postList.findIndex(function (postRecord) { return postRecord.PostID === targetPostRecord.PostID; });
            if (targetIndex !== -1) {
                state.postList[targetIndex] = targetPostRecord;
            }
            else {
                state.postList.push(targetPostRecord);
            }
        });
        //.addCase(ATTENDANCE_RECORD_DELETE,(state,action:PayloadAction<AttendanceRecord>)=>{
        //     state.postList = state.postList.filter((postRecord:PostRecord)=>postRecord.PostID !== action.payload.Post.PostID as number);
        // });
    },
});
export var UPDATE = (_a = postSlice.actions, _a.UPDATE), DELETE = _a.DELETE, INSERT_SETUP = _a.INSERT_SETUP;
export default postSlice.reducer;
