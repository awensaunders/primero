import { expect } from "chai";

import index from "./index";

describe("<IndexFilters /> - filter-types/switch-filter/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
  });
});
