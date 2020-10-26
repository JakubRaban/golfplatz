import { toast } from 'react-toastify';

const notificationConfig = {
  position: toast.POSITION.BOTTOM_CENTER,
  autoClose: 3000,
  pauseOnFocusLoss: false,
};

class Alert {
  success(content) {
    toast.success(content, notificationConfig);
  }

  error(content) {
    toast.error(content, notificationConfig);
  }
}

export default new Alert();
