import { toast } from 'react-toastify';

const successNotificationConfig = {
  position: toast.POSITION.BOTTOM_CENTER,
  autoClose: 3000,
  pauseOnFocusLoss: false,
};

const errorNotificationConfig = {
  position: toast.POSITION.BOTTOM_CENTER,
  autoClose: 5000,
  pauseOnFocusLoss: true,
};

class Alert {
  success(content) {
    toast.success(content, successNotificationConfig);
  }

  error(content) {
    toast.error(content, errorNotificationConfig);
  }
}

export default new Alert();
