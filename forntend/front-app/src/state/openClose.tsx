import {atom, RecoilState} from 'recoil';




//右側に表示される領域の開く閉じる状態を管理
export const SheetOpen:RecoilState<boolean> = atom({
    key:'SheetOpen',
    default:false,
});

//ログインモーダルを表示するかどうかのフラグ
export const LoginDialogOpen:RecoilState<boolean> = atom({
    key:'LoginDialog',
    default:false
});

export const FindDialogOpen:RecoilState<boolean> = atom({
    key:"FindDialogOpen",
    default:false
});



