import React from "react";
import { MemoryRouter } from "react-router-dom";

const MockRouter = ({ children, initialEntries = ["/"] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  );
};

export default MockRouter;
