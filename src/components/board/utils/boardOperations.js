// utils/boardOperations.js

// Eliminar un board
export const deleteBoard = async (
  boardsList,
  setBoardsList,
  boardId,
  setOpenOptionsId,
  token,
  secureFetch
) => {
  setBoardsList(boardsList.filter((board) => board.id !== boardId));
  setOpenOptionsId(null);

  await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/boards/${boardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Añadir un nuevo board
export const addNewBoard = async (
  boardsList,
  setBoardsList,
  secureFetch,
  user,
  token
) => {
  const newBoard = {
    id: `board-${Date.now()}`,
    title: "Nuevo Tablero",
    estado: "active",
    deleted: false,
    ownerId: "aaaf6a28-89c6-4b92-b79b-25931fd7333a",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [],
  };
  await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/boards`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      title: "Tablero Nuevo ",
      ownerId: user.id,
    }),
  });
  setBoardsList([newBoard, ...boardsList]);
};
