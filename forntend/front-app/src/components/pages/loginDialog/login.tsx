import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "../../ui/dialog";

import { Button } from '../../ui/button';
import { InputOTP,InputOTPGroup,InputOTPSlot } from '../../ui/input-otp';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from '../../../state/openClose';

const Login:React.FC = () => {
    const [openDialog,setOpenDialog] = useRecoilState(LoginDialogOpen);

  return (
    <Dialog open={openDialog}>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>認証</DialogTitle>
        <DialogDescription>
            ログインが必要です
        </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
                <InputOTP maxLength={3}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0}/>
                        <InputOTPSlot index={0}/>
                        <InputOTPSlot index={0}/>
                    </InputOTPGroup>
                </InputOTP>
            </div>
            
          </div>
        </form>
        <Button onClick={()=>setOpenDialog(false)}>
            閉じる
        </Button>
    </DialogContent>
    </Dialog>
  )
}

export default Login;