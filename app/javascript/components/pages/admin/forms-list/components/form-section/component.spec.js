import { mountedComponent, screen } from "test-utils";
import { List } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import TableRow from "../table-row";

import FormSection from "./component";

describe("<FormsList />/components/<FormSection />", () => {

  beforeEach(() => {
    const group = List([
      {
        name: "Section",
        order: 0,
        module_ids: ["module-1"],
        parent_form: "form_2",
        unique_id: "form_section_1",
        editable: false,
        id: 1
      }
    ]);

    const RenderFormSection = () => (
      <DragDropContext>
        <FormSection group={group} collection="form-1" />
      </DragDropContext>
    );

    mountedComponent(<RenderFormSection  />);

  });

  it("renders <Droppable/>", () => {
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });

  it("renders <TableRow/>", () => {
    expect(screen.getByText("form_section.form_name")).toBeInTheDocument();
  });

});
