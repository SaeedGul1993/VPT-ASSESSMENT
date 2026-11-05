import { memo } from "react";
import { Toaster as HotToaster } from "react-hot-toast";
import { toastPosition, zIndex } from "../../constants/Common.constants";

const Toaster = () => (
  <HotToaster
    position={toastPosition}
    containerStyle={{ zIndex: zIndex.toast }}
  />
);

export default memo(Toaster);
