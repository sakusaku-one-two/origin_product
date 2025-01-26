import React from 'react';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './appSidebar';
import { Outlet } from 'react-router-dom';
import Login from './loginDialog/login';
import { Button } from '../ui/button';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from '../../state/openClose';
import { LogOut, User } from 'lucide-react';
import { UPDATE as LOGIN_INFO } from '@/redux/slices/loginSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
var Layout = function () {
    var _a = useRecoilState(LoginDialogOpen), loginOpen = _a[0], setLoginOpen = _a[1];
    var loginInfo = useSelector(function (state) { return state.LOGIN; });
    var dispatch = useDispatch();
    var loginModaleOpen = function () {
        setLoginOpen(!loginOpen);
    };
    var loguoutHandler = function () {
        fetch("/api/logout", {
            method: 'POST'
        }).then(function (_) {
            alert("ログアウトしました");
        }).catch(function (_) {
            alert("ログアウトに失敗しました");
        }).finally(function () {
            var loginState = {
                userName: '',
                isLogin: false,
            };
            dispatch(LOGIN_INFO(loginState));
            window.location.reload();
        });
    };
    return (React.createElement(SidebarProvider, null,
        React.createElement(AppSidebar, null),
        React.createElement("body", { className: "relative flex min-h-screen w-full flex-col bg-background" },
            React.createElement("header", { className: "sticky top-0 z-50\n                 w-full border-border/40 bg-background/95 bg-blue-500\n                 backdrop-blur supports-[backdrop-filter]:bg-background/60" },
                React.createElement("div", { className: 'container flex  items-center gap-5' },
                    React.createElement(SidebarTrigger, null),
                    loginInfo.isLogin ? React.createElement(Button, { onClick: loguoutHandler },
                        "\u30ED\u30B0\u30A2\u30A6\u30C8",
                        React.createElement(LogOut, null)) : React.createElement(Button, { onClick: loginModaleOpen },
                        "\u30ED\u30B0\u30A4\u30F3",
                        React.createElement(User, null)))),
            React.createElement("main", { className: 'w-full' },
                React.createElement(Outlet, null))),
        React.createElement(Login, null)));
};
export default Layout;
