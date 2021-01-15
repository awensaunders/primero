/* eslint-disable react/no-multi-comp, react/display-name */
<<<<<<< HEAD
import React, { useEffect } from "react";
=======
import React from "react";
>>>>>>> 0cb35a1ab2526af912cee61a6d94f48c0c21756e
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { RECORD_TYPES } from "../../../../../../../config";
import { useI18n } from "../../../../../../i18n";
import { getShortIdFromUniqueId } from "../../../../../../records/utils";
import { selectRecord } from "../../../../../../records";
import { getFields, getRecordForms } from "../../../../../selectors";
import TraceActions from "../trace-actions";

import { NAME, TOP_FIELD_NAMES } from "./constants";

const Component = ({ selectedForm, recordType, potentialMatch, handleBack, handleConfirm }) => {
import { getFields, getOrderedRecordForms } from "../../../../../selectors";
import TraceActions from "../trace-actions";
import FieldRow from "../field-row";

import { NAME, TOP_FIELD_NAMES } from "./constants";
import { getComparisons } from "./utils";
import styles from "./styles.css";

const Component = ({ selectedForm, recordType, potentialMatch, handleBack, handleConfirm }) => {
  const css = makeStyles(styles)();
  const { id } = useParams();
  const record = useSelector(state => selectRecord(state, { isShow: true }, recordType, id));
  const i18n = useI18n();
  const fields = useSelector(state => getFields(state));
  const forms = useSelector(state =>
    getOrderedRecordForms(state, { primeroModule: record.get("module_id"), recordType: RECORD_TYPES.cases })
  );
  const traceId = getShortIdFromUniqueId(potentialMatch.getIn(["trace", "id"]));
  const caseId = potentialMatch.getIn(["case", "case_id_display"]);
  const comparedFields = potentialMatch.getIn(["comparison", "case_to_trace"], fromJS([]));
  const topFields = TOP_FIELD_NAMES.map(fieldName => fields.find(field => field.name === fieldName)).filter(
    field => field
  );

  const topComparisons = getComparisons({ fields: topFields, comparedFields, includeEmpty: true });

  const comparedForms = forms.map(form => {
    const comparisons = getComparisons({ fields: form.fields, comparedFields });

    return { form, comparisons };
  });

  const renderFieldRows = comparisons =>
    comparisons.length &&
    comparisons.map(comparison => (
      <FieldRow
        field={comparison.field}
        traceValue={comparison.traceValue}
        caseValue={comparison.caseValue}
        key={comparison.field.name}
      />
    ));

  const renderForms = () =>
    comparedForms.map(comparedForm => {
      const { form, comparisons } = comparedForm;

      return (
        <React.Fragment key={form.unique_id}>
          <Grid container item>
            <Grid item xs={12}>
              <h2>{form.name[i18n.locale]}</h2>
            </Grid>
          </Grid>
          {renderFieldRows(comparisons) || (
            <span className={css.nothingFound}>{i18n.t("tracing_request.messages.nothing_found")}</span>
          )}
        </React.Fragment>
      );
    });

  return (
    <>
      <TraceActions handleBack={handleBack} handleConfirm={handleConfirm} selectedForm={selectedForm} />
      <Grid container spacing={2}>
        <Grid container item>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <h2>
              {i18n.t("tracing_request.trace")} {traceId}
            </h2>
          </Grid>
          <Grid item xs={4}>
            <h2>
              {i18n.t("case.label")} {caseId}
            </h2>
          </Grid>
        </Grid>
        {renderFieldRows(topComparisons)}
        {renderForms()}
      </Grid>
    </>
  );
};

Component.propTypes = {
  handleBack: PropTypes.func,
  handleConfirm: PropTypes.func,
  potentialMatch: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
