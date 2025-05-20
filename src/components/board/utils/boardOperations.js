// Reordenar boards
export const reorderBoards = (
  boardsList,
  setBoardsList,
  sourceIndex,
  destinationIndex
) => {
  const result = Array.from(boardsList);
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);
  setBoardsList(result);
};

// Eliminar un board
export const deleteBoard = (
  boardsList,
  setBoardsList,
  boardId,
  setOpenOptionsId
) => {
  setBoardsList(boardsList.filter((board) => board.id !== boardId));
  setOpenOptionsId(null);
};

// Añadir un nuevo board
export const addNewBoard = (boardsList, setBoardsList) => {
  const newBoard = {
    id: `board-${Date.now()}`,
    title: "Nuevo Tablero",
    estado: "active",
    deleted: false,
    ownerId: "example-owner",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [],
  };

  setBoardsList([...boardsList, newBoard]);
};
