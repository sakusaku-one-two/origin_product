var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
import { createSlice } from "@reduxjs/toolkit";
import { UPDATE as ATTENDANCE_RECORD_UPDATE, DELETE as ATTENDANCE_RECORD_DELETE, INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP } from "./attendanceSlice";
// -----------------------[LocationRecordの初期値]-----------------------------
export var initialLocationState = {
    isLoading: false,
    locationList: [],
};
//--------------------------[重複を削除]----------------------------------------
function UniqueLocationRecords(locationRecords) {
    return locationRecords.filter(function (record, index, self) { return self.findIndex(function (t) { return t.LocationID === record.LocationID && t.ClientID === record.ClientID; }) === index; });
}
// -----------------------[LocationRecordの更新]-----------------------------
function updateLocationRecords(state, updateLocationRecords) {
    var newReplacedRecords = state.map(function (record) {
        var targetRecord = updateLocationRecords.find(function (updateRecord) { return updateRecord.LocationID === record.LocationID && updateRecord.ClientID === record.ClientID; });
        if (targetRecord) {
            return targetRecord;
        }
        return record;
    });
    // 重複を削除してソート 
    return UniqueLocationRecords(__spreadArray(__spreadArray([], newReplacedRecords, true), updateLocationRecords, true)).sort(function (a, b) { return a.LocationID - b.LocationID; });
}
// -----------------------[LocationRecordの削除]-----------------------------
function deleteLocationRecords(state, deleteLocationRecords) {
    return state.filter(function (record) { return !deleteLocationRecords.includes(record); });
}
// -----------------------[LocationRecordのスライス]-----------------------------
export var LocationSlice = createSlice({
    name: "LOCATION_RECORD",
    initialState: initialLocationState,
    reducers: {
        INSERT_SETUP: function (state, action) {
            state.locationList = UniqueLocationRecords(__spreadArray(__spreadArray([], state.locationList, true), action.payload, true));
        },
        UPDATE: function (state, action) {
            state.locationList = updateLocationRecords(state.locationList, [action.payload.Location]);
        },
        DELETE: function (state, action) {
            state.locationList = deleteLocationRecords(state.locationList, [action.payload.Location]);
        }
    },
    extraReducers: function (builder) {
        builder
            .addCase(ATTENDANCE_RECORD_UPDATE, function (state, action) {
            state.locationList = updateLocationRecords(state.locationList, [action.payload.Location]);
        })
            .addCase(ATTENDANCE_RECORD_DELETE, function (state, action) {
            state.locationList = deleteLocationRecords(state.locationList, [action.payload.Location]);
        })
            .addCase(ATTENDANCE_RECORD_INSERT_SETUP, function (state, action) {
            state.locationList = updateLocationRecords(state.locationList, UniqueLocationRecords(action.payload.map(function (record) { return record.Location; })));
        });
    }
});
export var INSERT_SETUP = (_a = LocationSlice.actions, _a.INSERT_SETUP), UPDATE = _a.UPDATE, DELETE = _a.DELETE;
export default LocationSlice.reducer;
