import { atom, useRecoilState } from "recoil";
export var SelectedRecord = atom({
    key: "SelectedRecord",
    default: {
        record: null,
        isSelected: false,
    },
});
export var useSelectedRecord = function () {
    var _a = useRecoilState(SelectedRecord), selectedRecord = _a[0], setSelectedRecord = _a[1];
    return [selectedRecord, function (updateData) { return setSelectedRecord(updateData); }];
};
