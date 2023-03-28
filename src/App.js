import Routers from './navigation/Router'
// import 'antd/dist/antd.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <Routers />
      <ToastContainer />
    </>
  );
}
export default App;