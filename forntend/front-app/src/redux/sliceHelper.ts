import { ChildRecord,AttendanceRecord,ReportTypeEnum, recodsState } from "./taskSlice";




// -----------------------[chiledrecordの値をattendancerecordの中に入れる]-----------------------------


export const UpdateAttendanceRecordByChildRecord = (childRecord:ChildRecord,targetRecord:AttendanceRecord):AttendanceRecord => {

    switch (childRecord.ReportType) {
        case ReportTypeEnum.HOME_DEPARTURE:
            return { ...targetRecord, HomeDepartureTimeStamp: childRecord.ReportTimeStamp, HomeDepartureStampByUser: childRecord.ReportByUser };
        case ReportTypeEnum.REACH:
            return { ...targetRecord, ReachTimeStamp: childRecord.ReportTimeStamp, ReachStampByUser: childRecord.ReportByUser };
        case ReportTypeEnum.START:
            return { ...targetRecord, StartTimeStamp: childRecord.ReportTimeStamp, StartStampByUser: childRecord.ReportByUser };
        case ReportTypeEnum.FINISH:
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