import uuid from "uuid";

import { queueIndexedDB } from "../../db";
import { METHODS } from "../../config";

export default ({ attachments, id, recordType }) => {
  const actions = Object.keys(attachments).reduce((prev, current) => {
    attachments[current].forEach(attachment => {
      const method = attachment?._destroy ? METHODS.DELETE : METHODS.POST;
      const isDelete = method === "DELETE";

      const path = `${recordType}/${id}/attachments${isDelete ? `/${attachment?._destroy}` : ""}`;

      const action = isDelete ? "DELETE_ATTACHMENT" : "SAVE_ATTACHMENT";

      // eslint-disable-next-line camelcase
      if (!attachment?.attachment_url) {
        prev.push({
          type: `${recordType}/${action}`,
          api: {
            path,
            method,
            ...(!isDelete && {
              body: { data: { ...attachment, field_name: current } }
            })
          },
          fromQueue: uuid.v4(),
          fromAttachment: {
            ...(isDelete && { id: attachment?._destroy }),
            field_name: current,
            record_type: recordType,
            record: { id }
          }
        });
      }
    });

    return prev;
  }, []);

  if (actions) {
    queueIndexedDB.add(actions);
  }
};
