import { atom } from 'recoil';
//右側に表示される領域の開く閉じる状態を管理
export var SheetOpen = atom({
    key: 'SheetOpen',
    default: false,
});
//ログインモーダルを表示するかどうかのフラグ
export var LoginDialogOpen = atom({
    key: 'LoginDialog',
    default: false
});
//検索モーダルを表示するかどうかのフラグ
export var FindDialogOpen = atom({
    key: "FindDialogOpen",
    default: false
});
