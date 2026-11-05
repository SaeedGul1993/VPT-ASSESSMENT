import toast from "react-hot-toast";
import { toastPosition } from "../constants/Common.constants";

const position = { position: toastPosition };

export const showSuccess = (message?: string) => {
  if (!message) return;
  toast.success(message, position);
};

export const showError = (message?: string) => {
  toast.error(message || "Something went wrong", position);
};
