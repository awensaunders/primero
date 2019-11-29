import React from "react";
import PropTypes from "prop-types";
import { emphasize, makeStyles, useTheme } from "@material-ui/core/styles";
import ReactSelect from "react-select";
import NoSsr from "@material-ui/core/NoSsr";

import { useI18n } from "../../i18n";

import { CUSTOM_AUTOCOMPLETE_NAME } from "./constants";

import {
  NoOptionsMessage,
  Control,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  MultiValue,
  Menu
} from ".";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250,
    minWidth: 290,
    marginTop: 5
  },
  input: {
    display: "flex",
    padding: 0,
    height: "auto"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    padding: "8px 3px"
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
    fontSize: 11,
    height: "auto"
  },
  chipLabel: {
    whiteSpace: "normal"
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 12,
    maxWidth: "calc(80% - 8px)",
    position: "absolute",
    marginLeft: 2,
    marginRight: 2
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 12,
    paddingLeft: 3
  },
  paper: {
    position: "absoulte",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    overflow: "auto"
  },
  divider: {
    height: theme.spacing(2)
  }
}));

const CustomAutoComplete = ({ props }) => {
  const classes = useStyles();
  const theme = useTheme();

  const i18n = useI18n();
  const { id, options, excludeEmpty, defaultValues, ...rest } = props;

  const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer
  };

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };
  const searchOptions = excludeEmpty
    ? options
    : [{ value: "", label: i18n.t("fields.select_single") }, ...options];

  return (
    <NoSsr>
      <ReactSelect
        id={id}
        classes={classes}
        styles={selectStyles}
        components={components}
        menuPosition="fixed"
        options={searchOptions}
        defaultValue={excludeEmpty ? defaultValues : searchOptions[0]}
        {...rest}
      />
    </NoSsr>
  );
};

CustomAutoComplete.displayName = CUSTOM_AUTOCOMPLETE_NAME;

CustomAutoComplete.propTypes = {
  components: PropTypes.object,
  id: PropTypes.string,
  props: PropTypes.object
};

export default CustomAutoComplete;
