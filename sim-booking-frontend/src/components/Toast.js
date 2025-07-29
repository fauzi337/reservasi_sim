import React, { useEffect, useRef } from 'react';

const iconMap = {
  success: 'check-circle-fill',
  danger: 'exclamation-triangle-fill',
  warning: 'exclamation-circle-fill',
  info: 'info-circle-fill',
  primary: 'star-fill',
  dark: 'moon-fill',
  light: 'sun-fill',
};

const Toast = ({ message, type = 'danger', show, onClose }) => {
  const toastRef = useRef(null);

useEffect(() => {
    console.log("🎯 Toast useEffect called:", { show, message, type });

    if (show && toastRef.current && window.bootstrap?.Toast) {
        const bsToast = new window.bootstrap.Toast(toastRef.current);
        console.log("✅ Toast initialized:", bsToast);
        bsToast.show();
    } else {
        console.warn("⚠️ Toast not initialized, condition failed", toastRef.current, window.bootstrap);
    }
}, [show]);


  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-4"
      style={{ zIndex: 1055 }}>
      <div
        ref={toastRef}
        className={`toast fade show text-bg-${type} border-0 shadow rounded-3 px-3`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true">
            <div className="d-flex">
                <div className="toast-body d-flex align-items-center">
                <i className={`me-2 bi bi-${iconMap[type]}`} style={{ fontSize: '2.0rem' }}></i>
                <span style={{fontSize: '18px'}}>{message}</span>
                </div>
                <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={onClose}
                ></button>
            </div>
        </div>
    </div>
  );
};

export default Toast;
