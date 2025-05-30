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
  const res = await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/boards`, {
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
  const data = await res.json(); 

  setBoardsList([{ ...data.data, tasks: [] }, ...boardsList]);
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
