import {atom, RecoilState,useRecoilState} from 'recoil';


export interface LoginInfo {
    isLogin:boolean
    userName:string
};

//ユーザーのログイン状態を管理するステート
export const LoginState:RecoilState<LoginInfo> = atom({
    key:'LoginState',
   default:{
        isLogin:false,
        userName:''
   } as LoginInfo
});

//ログイン状態管理用のUSE HOOKS
export const useLogin = ():[
    LoginInfo,(updateInfo:LoginInfo) => void
] => {
    const [currentLoginInfo,setLoginInfo] = useRecoilState(LoginState);
    return [currentLoginInfo,setLoginInfo];
};
