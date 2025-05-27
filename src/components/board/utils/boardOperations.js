// utils/boardOperations.js

// Reordenar boards usando Swapy
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

// Manejar el evento de swap de Swapy para boards
export const handleBoardSwap = (boardsList, setBoardsList, swapEvent) => {
  const { oldIndex, newIndex } = swapEvent.data;
  
  if (oldIndex === newIndex) return;
  
  const result = Array.from(boardsList);
  const [removed] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, removed);
  
  setBoardsList(result);
};