import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { Reopen } from "components/record-actions/reopen";
import { CloseCase } from "components/record-actions/close-case";
import { Transitions } from "components/record-actions/transitions";
import { Notes } from "components/record-actions/notes";
import RecordActions from "./component";

describe("<RecordActions />", () => {
  let component;
  const defaultState = Map({
    user: Map({
      permissions: Map({
        cases: ["manage"]
      })
    })
  });
  const props = {
    recordType: "cases",
    mode: { isShow: true },
    record: Map({ status: "open" })
  };

  describe("Component Reopen", () => {
    const record = Map({ status: "closed" });
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        {
          ...props,
          record
        },
        defaultState
      ));
    });
    it("renders Reopen", () => {
      expect(component.find(Reopen)).to.have.length(1);
    });
  });

  describe("Component CloseCase", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders CloseCase", () => {
      expect(component.find(CloseCase)).to.have.length(1);
    });
  });

  describe("Component Transitions", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });
    it("renders Transitions", () => {
      expect(component.find(Transitions)).to.have.length(1);
    });
  });

  describe("Component Notes", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        Map({
          user: Map({
            permissions: Map({
              cases: Map({ manage: "manage" })
            })
          })
        })
      ));
    });

    it("renders Notes", () => {
      expect(component.find(Notes)).to.have.length(1);
    });
  });
});
