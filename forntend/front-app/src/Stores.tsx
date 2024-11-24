import {FC,ReactNode} from 'react';
import {RecoilRoot} from 'recoil';
import { Provider } from 'react-redux';
import RecordStore from './redux/store';

const Stores:FC<{children:ReactNode}> = ({children}) => {
  return (  
    <RecoilRoot>
        <Provider store={RecordStore}>
            {children}
        </Provider>
    </ RecoilRoot>
  )
};

export default Stores;