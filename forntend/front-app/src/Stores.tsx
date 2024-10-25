import {FC,ReactNode} from 'react';
import {RecoilRoot} from 'recoil';

const Stores:FC<{children:ReactNode}> = ({children}) => {
  return (  
    <RecoilRoot>
        {children}
    </ RecoilRoot>
  )
};

export default Stores;