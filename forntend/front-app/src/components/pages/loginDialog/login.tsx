import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "../../ui/dialog";
import { Input } from '../../ui/input';

import { Button } from '../../ui/button';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from '../../../state/openClose';
import { useNavigate } from 'react-router-dom';
import { useAttendanceDispatch } from '@/hooks';

// const API_URL = import.meta.env.VITE_API_URL;

const Login:React.FC = () => {
    const [openDialog,setOpenDialog] = useRecoilState(LoginDialogOpen);
    const navigate = useNavigate();
    const dispatch = useAttendanceDispatch();

    const [userName,setUserName] = useState<string>("");
    const [password,setPassword ] = useState<string>("");


    const handleLogin = async () => {
      try {
        const response = await fetch(`/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userName: userName, password: password}),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.payload,data.records.payload);
            dispatch({
              type: data.records.action,
              payload: data.records.payload,
            });

            try {
              const response = await fetch(`/api/health`, {
                method: "GET",
              });
              if (response.ok) {
                alert("サーバーが正常に動作しています");
              } else {
                alert("サーバーが正常に動作していません");
              }
            } catch (error) {
              alert("サーバーが正常に動作していません");
            
            }

            // ログイン成功後にダッシュボードに遷移
            navigate("/dashboard");
            setOpenDialog(false);
            dispatch({type:"WEBSOCKET/SETUP",payload:data.records.payload});
        } else {
            
            const message = await response.json();
            alert(message);
        } 
      } catch (error) {
        alert("ログインに失敗しました。");
        console.error(error);
      }


    }
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog} >
    <DialogContent className='flex flex-col gap-4 content-center' >
        <DialogHeader>
        <DialogTitle>認証</DialogTitle>
        <DialogDescription>
            ログインが必要です
        </DialogDescription>
        </DialogHeader>
    
          <div className="grid w-full items-center gap-4">
            
            <Input placeholder='ユーザーID' value={userName} onChange={(e)=>setUserName(e.target.value)}  />
            <Input placeholder='パスワード' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}  />
            
          </div>
          
       
        <Button onClick={handleLogin}>
            ログイン 
          </Button>
        <Button onClick={()=>setOpenDialog(false)}>
            閉じる
        </Button>
    </DialogContent>
    </Dialog>
  )
}

export default Login;