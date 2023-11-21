// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("Application - Actions", () => {
  describe("actions", () => {
    let clone;

    before(() => {
      clone = { ...actions };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "DISABLE_NAVIGATION",
      "FETCH_AGENCY_LOGO_OPTIONS",
      "FETCH_AGENCY_LOGO_OPTIONS_FAILURE",
      "FETCH_AGENCY_LOGO_OPTIONS_SUCCESS",
      "FETCH_AGENCY_LOGO_OPTIONS_STARTED",
      "FETCH_ROLES",
      "FETCH_ROLES_FAILURE",
      "FETCH_ROLES_FINISHED",
      "FETCH_ROLES_STARTED",
      "FETCH_ROLES_SUCCESS",
      "FETCH_SYSTEM_PERMISSIONS",
      "FETCH_SYSTEM_PERMISSIONS_FAILURE",
      "FETCH_SYSTEM_PERMISSIONS_FINISHED",
      "FETCH_SYSTEM_PERMISSIONS_STARTED",
      "FETCH_SYSTEM_PERMISSIONS_SUCCESS",
      "FETCH_WEBPUSH_CONFIG",
      "FETCH_WEBPUSH_CONFIG_FAILURE",
      "FETCH_WEBPUSH_CONFIG_FINISHED",
      "FETCH_WEBPUSH_CONFIG_STARTED",
      "FETCH_WEBPUSH_CONFIG_SUCCESS",
      "FETCH_SANDBOX_UI",
      "FETCH_SANDBOX_UI_FAILURE",
      "FETCH_SANDBOX_UI_FINISHED",
      "FETCH_SANDBOX_UI_STARTED",
      "FETCH_SANDBOX_UI_SUCCESS",
      "FETCH_SYSTEM_SETTINGS",
      "FETCH_SYSTEM_SETTINGS_SUCCESS",
      "FETCH_USER_GROUPS",
      "FETCH_USER_GROUPS_FAILURE",
      "FETCH_USER_GROUPS_FINISHED",
      "FETCH_USER_GROUPS_STARTED",
      "FETCH_USER_GROUPS_SUCCESS",
      "NETWORK_STATUS",
      "SET_RETURN_URL",
      "SET_USER_IDLE",
      "FETCH_MANAGED_ROLES",
      "FETCH_MANAGED_ROLES_FAILURE",
      "FETCH_MANAGED_ROLES_SUCCESS",
      "FETCH_MANAGED_ROLES_STARTED",
      "FETCH_MANAGED_ROLES_FINISHED",
      "SET_THEME"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(actions).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
