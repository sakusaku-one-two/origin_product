import React from 'react';
import { PlanNames } from './helper';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../ui/card';
import { Checkbox } from '@/components/ui/checkbox';
// サブタイムレコード 選択されたレコードと同じ計画番号のレコードを表示するためのカード
var SubTimeRecord = function (_a) {
    var _b, _c;
    var record = _a.record;
    console.log("SubTimeRecord", record);
    return (React.createElement(Card, null,
        React.createElement("div", { className: 'flex items-center' },
            React.createElement(Checkbox, { defaultChecked: record.isSelected, onClick: function () { record.isSelected = !record.isSelected; } }),
            React.createElement(CardHeader, null,
                React.createElement(CardDescription, null,
                    PlanNames.get(record.timeRecord.PlanNo),
                    " ",
                    record.timeRecord.PlanTime.toLocaleString())),
            React.createElement(CardContent, null,
                React.createElement(CardTitle, null, (_b = record.employeeRecord) === null || _b === void 0 ? void 0 : _b.Name),
                React.createElement(CardDescription, null, (_c = record.locationRecord) === null || _c === void 0 ? void 0 : _c.LocationName)))));
};
export default SubTimeRecord;
