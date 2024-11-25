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
import { InputOTP,InputOTPGroup,InputOTPSlot } from '../../ui/input-otp';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from '../../../state/openClose';

const Login:React.FC = () => {
    const [openDialog,setOpenDialog] = useRecoilState(LoginDialogOpen);

    const [userId,setUserId] = useState<string>("");
    const [password,setPassword ] = useState<string>("");
  return (
    <Dialog open={openDialog} >
    <DialogContent className='flex flex-col gap-4 content-center' onClose={()=>setOpenDialog(false)}>
        <DialogHeader>
        <DialogTitle>認証</DialogTitle>
        <DialogDescription>
            ログインが必要です
        </DialogDescription>
        </DialogHeader>
    
          <div className="grid w-full items-center gap-4">
            
            <div className="flex flex-col space-y-1.5">
                <InputOTP maxLength={20}>
                    <InputOTPGroup >
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <Input placeholder='ユーザーID' value={userId} onChange={(e)=>setUserId(e.target.value)}  />
            <Input placeholder='パスワード' value={password} onChange={(e)=>setPassword(e.target.value)}  />
            
          </div>
          
       
        <Button onClick={()=>{
          alert(userId);
        }}>
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