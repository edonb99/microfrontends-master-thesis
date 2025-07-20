import React from "react";
import { MemoryRouter } from "react-router-dom";

const MockRouter = ({ children, initialEntries = ["/product/1"] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  );
};

export default MockRouter;
