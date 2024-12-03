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

    const [userId,setUserId] = useState<string>("");
    const [password,setPassword ] = useState<string>("");


    const handleLogin = async () => {
      try {
        const response = await fetch(`/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: userId, password: password}),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch({
              type: data.Records.Action,
              payload: data.Records.Payload,
            });
            navigate("/dashboard");
        } else {
            alert("ログインに失敗しました。");
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
            
            <Input placeholder='ユーザーID' value={userId} onChange={(e)=>setUserId(e.target.value)}  />
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