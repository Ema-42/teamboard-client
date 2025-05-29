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
    ownerId: user.id,
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
      title: "Nuevo Tablero",
      ownerId: user.id,
    }),
  });
  setBoardsList([newBoard, ...boardsList]);
};

export const editBoard = async (boardId, token, editBoard, secureFetch) => {
  await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/boards/${boardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: editBoard }),
  });
};
