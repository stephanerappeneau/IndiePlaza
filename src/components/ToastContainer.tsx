import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainerBar: React.FC = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    pauseOnFocusLoss
    pauseOnHover
    toastClassName="light-blue-shadow hover:cursor-pointer"
    closeButton={false}
  />
);

export default ToastContainerBar;
