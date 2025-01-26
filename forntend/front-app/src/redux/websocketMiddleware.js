import { RecordRequest } from './webSocketHelper';
var socket;
// WebSocketのインスタンスを取得
function getSocket() {
    if (!socket) {
        socket = new WebSocket(import.meta.env.VITE_WS_URL);
    }
    return socket;
}
;
function deleteSocket() {
    socket = null;
}
// サーバーリアルタイム接続の初期化 
function WebSocketSetup(socket, next, store) {
    //nextは次のミドルウエアに渡される関数
    socket.onopen = function () {
        next({
            type: "WEBSOCKET/OPENED",
            payload: "サーバーリアルタイム接続が開始しました。"
        });
    };
    // サーバーリアルタイム接続に失敗
    socket.onerror = function (event) {
        alert("サーバーリアルタイム接続に失敗しました。");
        console.log(event);
        next({
            type: "WEBSOCKET/ERROR",
            payload: "websocketの接続に失敗しました。"
        });
        fetch("api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        next({
            type: "LOGIN/UPDATE",
            payload: {
                userName: "",
                isLogin: false
            }
        });
        socket.close();
    };
    socket.onclose = function () {
        alert("リアルタイム同期が切断されました。再度ログインしてください。");
        deleteSocket();
    };
    // サーバーからのメッセージを受信してREDUXのリデューサーに届ける
    socket.onmessage = function (event) {
        var state = store.getState();
        var selectedRecord = state.SELECTED_RECORDS.selectedRecords;
        var persedEvent = JSON.parse(event.data);
        var actionObject = { type: persedEvent["Action"], payload: persedEvent["Payload"] };
        RecordRequest(state, actionObject);
        // ミドルウエアのチェーンに受信したアクションオブジェクトを渡す
        next(actionObject);
        // 選択中のレコードが更新された場合は、選択中のレコードをクリアする
        if (selectedRecord !== null && (actionObject.type === "TIME_RECORD/UPDATE" || actionObject.type === "TIME_RECORD/DELETE")) {
            var insertRecord = actionObject.payload;
            if (insertRecord.ID === selectedRecord.timeRecord.ID) {
                //選択中のレコードをクリアにする。
                next({
                    type: "SELECTED_RECORDS/SET_SELECTED_RECORDS",
                    payload: null
                });
            }
        }
    };
}
var WebSocketMiddleware = function (store) { return function (next) {
    store.getState(); //リンターがうるさいので一回呼び出す。
    var socket;
    return function (action) {
        var actionObject = action;
        switch (actionObject.type) {
            case "WEBSOCKET/SETUP":
                // サーバーリアルタイム接続の初期化
                socket = getSocket();
                WebSocketSetup(socket, next, store);
                return;
            case "SELECTED_RECORDS/SET_SELECTED_RECORDS":
                // 選択中のレコードを更新
                next(actionObject);
                return;
            default:
                // サーバーへのメッセージ送信
                if (socket) {
                    socket.send(JSON.stringify({
                        Action: actionObject.type,
                        Payload: actionObject.payload
                    }));
                    return;
                }
                else {
                    // サーバーリアルタイム接続が開始していない場合は、通常のミドルウエアに渡す
                    next(actionObject);
                }
        }
        ;
    };
}; };
export default WebSocketMiddleware;
