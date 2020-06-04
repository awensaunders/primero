import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "SAVE_REPORT",
  "SAVE_REPORT_FAILURE",
  "SAVE_REPORT_FINISHED",
  "SAVE_REPORT_STARTED",
  "SAVE_REPORT_SUCCESS"
]);
