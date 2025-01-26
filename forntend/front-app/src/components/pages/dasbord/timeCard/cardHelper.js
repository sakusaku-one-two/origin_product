export var SetAlertAnimation = function (record) {
    var timeRecord = record.timeRecord;
    //アラート状態で、完了、無視状態でない場合のアニメーション
    if (timeRecord.IsAlert && !timeRecord.IsComplete) {
        return "bg-red-500 animate-pulse";
    }
    //5分前アラート無視状態で、完了、無視状態でない場合のアニメーション
    if (timeRecord.PreAlert && !timeRecord.IsComplete) {
        return "bg-yellow-500 animate-pulse";
    }
    return "";
};
//カードの種類 書く番号に応じて表示スタイルを変更する。
export var CardType;
(function (CardType) {
    CardType[CardType["PreAlert"] = 1] = "PreAlert";
    CardType[CardType["PreAlertIgnore"] = 2] = "PreAlertIgnore";
    CardType[CardType["Alert"] = 3] = "Alert";
    CardType[CardType["Ignore"] = 4] = "Ignore";
    CardType[CardType["Wait"] = 5] = "Wait";
    CardType[CardType["ControlPanel"] = 6] = "ControlPanel";
})(CardType || (CardType = {}));
