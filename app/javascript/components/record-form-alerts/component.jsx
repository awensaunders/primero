// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { fromJS, List } from "immutable";

import { useI18n } from "../i18n";
import InternalAlert from "../internal-alert";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getRecordFormAlerts } from "../records";
import { getSubformsDisplayName, getValidationErrors } from "../record-form";
import { getDuplicatedFields } from "../record-form/selectors";

import { getMessageData } from "./utils";
import { NAME } from "./constants";

const Component = ({ form, recordType, attachmentForms }) => {
  const i18n = useI18n();

  const recordAlerts = useMemoizedSelector(state => getRecordFormAlerts(state, recordType, form.unique_id));
  const validationErrors = useMemoizedSelector(state => getValidationErrors(state, form.unique_id));
  const subformDisplayNames = useMemoizedSelector(state => getSubformsDisplayName(state, i18n.locale));
  const duplicatedFields = useMemoizedSelector(state => getDuplicatedFields(state, recordType, form.unique_id));

  const errors =
    validationErrors?.size &&
    validationErrors
      .get("errors", fromJS([]))
      .entrySeq()
      .map(([key, value]) => {
        if (List.isList(value)) {
          return fromJS({
            message: i18n.t("error_message.address_subform_fields", {
              subform: subformDisplayNames.get(key) || attachmentForms.getIn([key, i18n.locale], ""),
              fields: value.filter(subform => Boolean(subform)).flatMap(subform => subform.keySeq()).size
            })
          });
        }

        return fromJS({ message: value });
      });

  const items = recordAlerts.map(alert =>
    fromJS({
      message: i18n.t(
        `messages.alerts_for.${alert.get("alert_for")}`,
        getMessageData({ alert, form, duplicatedFields, i18n })
      )
    })
  );

  return (
    <>
      {errors?.size ? (
        <InternalAlert
          title={i18n.t("error_message.address_form_fields", {
            fields: errors?.size
          })}
          items={fromJS(errors)}
          severity="error"
        />
      ) : null}
      {items?.size ? <InternalAlert items={fromJS(items)} /> : null}
    </>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  attachmentForms: fromJS([])
};

Component.propTypes = {
  attachmentForms: PropTypes.object,
  form: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
