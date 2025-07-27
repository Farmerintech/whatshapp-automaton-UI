import React, { createContext, useContext } from "react";

const DragDropContext = createContext();

export const useDragDrop = () => useContext(DragDropContext);

export default DragDropContext;
