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
import { useAttendanceDispatch, useSetLoginInfo } from '@/hooks';
import { INSERT_SETUP as INSERT_ATTENDANCE_MESSAGE,UPDATE as ATTENDANCE_UPDATE } from '../../../redux/slices/attendanceSlice';
import { UPDATE } from '@/redux/slices/timeSlice';
import { sampleAttendanceRecords } from '@/redux/slices/sampleRecords';
import { AttendanceRecord } from '@/redux/recordType';
// import { AttendanceRecord } from '../../../redux/recordType';
// const API_URL = import.meta.env.VITE_API_URL;


const Login:React.FC = () => {
    const [openDialog,setOpenDialog] = useRecoilState(LoginDialogOpen);
    const navigate = useNavigate();
    const dispatch = useAttendanceDispatch();
    
    const {setLoginInfo} = useSetLoginInfo();


    const [userName,setUserName] = useState<string>("");
    const [password,setPassword ] = useState<string>("");

    const SampleExecute = () => {//サンプルデータでのお試し
      navigate("/dashbord");
      setOpenDialog(false);
      sampleAttendanceRecords.forEach((value:AttendanceRecord) => {//サンプルデータを更
        dispatch(ATTENDANCE_UPDATE(value));
      });
      setTimeout(()=>{//アラートを表示
        const targetRecord = sampleAttendanceRecords[0].TimeRecords[0];
        
        dispatch(UPDATE({//アラートを表示
          ...targetRecord,
          IsAlert:true
        }));
      },10000);

      setTimeout(()=>{
        const targetRecord = sampleAttendanceRecords[1].TimeRecords[0];
        dispatch(UPDATE({//アラートを表示
          ...targetRecord,
          IsAlert:true
        }));
      },20000);
    };

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
            dispatch(INSERT_ATTENDANCE_MESSAGE(
              [{
                ManageID:0
              } as AttendanceRecord]
            ));
            dispatch(INSERT_ATTENDANCE_MESSAGE(
              data.records.payload
            ));
            
              setLoginInfo({
                isLogin:true,
                userName:data.user.userName
              })
           
            // ログイン成功後にダッシュボードに遷移
            navigate("/dashbord");
            setOpenDialog(false);
            dispatch({type:"WEBSOCKET/SETUP",payload:data.records.payload});
        } else {
            alert("ログイン不可です。");
        } 
      } catch (error:unknown) {
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
        <Button onClick={SampleExecute}>
          サンプルデータでのお試し
        </Button>
    </DialogContent>
    </Dialog>
  )
}

export default Login;