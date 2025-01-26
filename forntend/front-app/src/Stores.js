import { RecoilRoot } from 'recoil';
import { Provider } from 'react-redux';
import RecordStore from './redux/store';
var Stores = function (_a) {
    var children = _a.children;
    return (React.createElement(RecoilRoot, null,
        React.createElement(Provider, { store: RecordStore }, children)));
};
export default Stores;
