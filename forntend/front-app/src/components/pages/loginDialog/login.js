var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "../../ui/dialog";
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from '../../../state/openClose';
import { useNavigate } from 'react-router-dom';
import { useAttendanceDispatch, useSetLoginInfo } from '@/hooks';
import { INSERT_SETUP as INSERT_ATTENDANCE_MESSAGE, UPDATE as ATTENDANCE_UPDATE } from '../../../redux/slices/attendanceSlice';
import { UPDATE } from '@/redux/slices/timeSlice';
import { sampleAttendanceRecords } from '@/redux/slices/sampleRecords';
// import { AttendanceRecord } from '../../../redux/recordType';
// const API_URL = import.meta.env.VITE_API_URL;
var Login = function () {
    var _a = useRecoilState(LoginDialogOpen), openDialog = _a[0], setOpenDialog = _a[1];
    var navigate = useNavigate();
    var dispatch = useAttendanceDispatch();
    var setLoginInfo = useSetLoginInfo().setLoginInfo;
    var _b = useState(""), userName = _b[0], setUserName = _b[1];
    var _c = useState(""), password = _c[0], setPassword = _c[1];
    var SampleExecute = function () {
        navigate("/dashbord");
        setOpenDialog(false);
        sampleAttendanceRecords.forEach(function (value) {
            dispatch(ATTENDANCE_UPDATE(value));
        });
        setTimeout(function () {
            var targetRecord = sampleAttendanceRecords[0].TimeRecords[0];
            dispatch(UPDATE(__assign(__assign({}, targetRecord), { IsAlert: true })));
        }, 10000);
        setTimeout(function () {
            var targetRecord = sampleAttendanceRecords[1].TimeRecords[0];
            dispatch(UPDATE(__assign(__assign({}, targetRecord), { IsAlert: true })));
        }, 20000);
    };
    var handleLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, message, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/login", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ userName: userName, password: password }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    dispatch(INSERT_ATTENDANCE_MESSAGE(data.records.payload));
                    setLoginInfo({
                        isLogin: true,
                        userName: data.user.userName
                    });
                    // ログイン成功後にダッシュボードに遷移
                    navigate("/dashbord");
                    setOpenDialog(false);
                    dispatch({ type: "WEBSOCKET/SETUP", payload: data.records.payload });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    message = _a.sent();
                    alert(message);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    alert("ログインに失敗しました。");
                    console.error(error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(Dialog, { open: openDialog, onOpenChange: setOpenDialog },
        React.createElement(DialogContent, { className: 'flex flex-col gap-4 content-center' },
            React.createElement(DialogHeader, null,
                React.createElement(DialogTitle, null, "\u8A8D\u8A3C"),
                React.createElement(DialogDescription, null, "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059")),
            React.createElement("div", { className: "grid w-full items-center gap-4" },
                React.createElement(Input, { placeholder: '\u30E6\u30FC\u30B6\u30FCID', value: userName, onChange: function (e) { return setUserName(e.target.value); } }),
                React.createElement(Input, { placeholder: '\u30D1\u30B9\u30EF\u30FC\u30C9', type: 'password', value: password, onChange: function (e) { return setPassword(e.target.value); } })),
            React.createElement(Button, { onClick: handleLogin }, "\u30ED\u30B0\u30A4\u30F3"),
            React.createElement(Button, { onClick: function () { return setOpenDialog(false); } }, "\u9589\u3058\u308B"),
            React.createElement(Button, { onClick: SampleExecute }, "\u30B5\u30F3\u30D7\u30EB\u30C7\u30FC\u30BF\u3067\u306E\u304A\u8A66\u3057"))));
};
export default Login;
