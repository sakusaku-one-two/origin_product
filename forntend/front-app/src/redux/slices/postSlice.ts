import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { PostRecord } from "../recordType";
import { UPDATE as ATTENDANCE_RECORD_UPDATE,
    
    INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP
    } from "./attendanceSlice";
import { AttendanceRecord } from "../recordType";
//----------------------------[初期値]----------------------------------------


export const initialPostState = {
    isLoading:false as boolean,
    postList:[] as PostRecord[],
};  

//----------------------------[更新]----------------------------------------
const UpdatePostList = (oldPostList:PostRecord[],newPostRecords:PostRecord[]):PostRecord[] => {
    if (oldPostList.length === 0) return newPostRecords;
    if (newPostRecords.length === 0) return oldPostList;
    
    const ReplacedRecord =  newPostRecords.map((newPostRecord:PostRecord)=>{
        
        const targetRecord = oldPostList.find((postRecord:PostRecord)=>postRecord.PostID === newPostRecord.PostID);
        if(targetRecord){
            return newPostRecord;
        }
        return targetRecord;
    });
    return ReplacedRecord as PostRecord[];
}

//----------------------------[createSlice]----------------------------------------

const postSlice = createSlice({
    name:"POST_RECORD",
    initialState:initialPostState,
    reducers:{
        UPDATE:(state,action:PayloadAction<PostRecord>)=>{
            state.postList = UpdatePostList(state.postList,[action.payload]);
            state.isLoading = false;        
        },
        DELETE:(state,action:PayloadAction<PostRecord>)=>{
            state.postList = state.postList.filter((postRecord)=>postRecord.PostID !== action.payload.PostID);
        },
        INSERT_SETUP:(state,action:PayloadAction<PostRecord>)=>{
            state.postList.push(action.payload);
        }, 
    },
    extraReducers:(builder)=>{
        builder.addCase(ATTENDANCE_RECORD_INSERT_SETUP,(state,action:PayloadAction<AttendanceRecord []>)=>{
            const attendanceRecords:AttendanceRecord[] = action.payload;
            const PostsList:PostRecord[] = attendanceRecords.map((attendanceRecord)=>{
                return attendanceRecord.Post;
            });
            state.postList = UpdatePostList(state.postList,PostsList);
        })
        .addCase(ATTENDANCE_RECORD_UPDATE,(state,action:PayloadAction<AttendanceRecord>)=>{ 
            const targetPostRecord:PostRecord = action.payload.Post;
            const targetIndex = state.postList.findIndex((postRecord:PostRecord)=>postRecord.PostID === targetPostRecord.PostID);
            if(targetIndex !== -1){     
                state.postList[targetIndex] = targetPostRecord;
            } else {
                state.postList.push(targetPostRecord);
            }
            
         });
         //.addCase(ATTENDANCE_RECORD_DELETE,(state,action:PayloadAction<AttendanceRecord>)=>{
        //     state.postList = state.postList.filter((postRecord:PostRecord)=>postRecord.PostID !== action.payload.Post.PostID as number);
        // });
    },
});     

export const { UPDATE,DELETE,INSERT_SETUP } = postSlice.actions;
export default postSlice.reducer;
