import { TimeRecord ,AttendanceRecord,PlanNo, recodsState,LocationRecord,EmployeeRecord } from "./taskSlice";




// -----------------------[chiledrecordの値をattendancerecordの中に入れる]-----------------------------


export const UpdateAttendanceRecordByChildRecord = (childRecord:TimeRecord,targetRecord:AttendanceRecord):AttendanceRecord => {

    switch (childRecord.PlanNo) {
        case PlanNo.HOME_DEPARTURE:
            return { ...targetRecord, HomeDepartureTimeStamp: childRecord.ReportTimeStamp, HomeDepartureStampByUser: childRecord.ReportByUser };
        case PlanNo.REACH:
            return { ...targetRecord, ReachTimeStamp: childRecord.ReportTimeStamp, ReachStampByUser: childRecord.ReportByUser };
        case PlanNo.START:
            return { ...targetRecord, StartTimeStamp: childRecord.ReportTimeStamp, StartStampByUser: childRecord.ReportByUser };
        case PlanNo.FINISH:
            return { ...targetRecord, FinishTimeStamp: childRecord.ReportTimeStamp, FinishStampByUser: childRecord.ReportByUser };
    }

};


// -----------------------[chiledrecordの値をstoreのstateに上書きする(新しいstateを返す)]-----------------------------


export const StateUpdateByChildRecord = (state:recodsState,chengeRecord:ChildRecord):recodsState => {
    
    const targetRecoed:AttendanceRecord = state.AttendanceRecords.filter((record:AttendanceRecord) => record.ManageID === chengeRecord.ManageID);
    if (targetRecoed === null) {
        throw new Error("対象の行が存在しません。（StateUpdateByChildRecord）");
    }

    const updatedAttndanceRecord:AttendanceRecord = UpdateAttendanceRecordByChildRecord(chengeRecord,targetRecoed);

    const getReport = ()

    switch (chengeRecord.ReportType) {
        case ReportTypeEnum.HOME_DEPARTURE:
            //自宅出発報告

        case ReportTypeEnum.REACH:
            //到着報告
        case ReportTypeEnum.START:
            ///上番報告
        case ReportTypeEnum.FINISH:
            ///下番報告

        default
            ///
    }


};