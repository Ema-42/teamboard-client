// utils/tasksOperations.js

// Guardar la tarjeta editada
export const saveEditedCard = (
  boardsList,
  setBoardsList,
  editingCardId,
  editingCardText
) => {
  if (editingCardId && editingCardText.trim() !== "") {
    setBoardsList(
      boardsList.map((board) => ({
        ...board,
        tasks: (board.tasks || []).map((task) =>
          task.id === editingCardId ? { ...task, title: editingCardText } : task
        ),
      }))
    );
  }
};

// Guardar la nueva tarjeta
export const saveNewCard = async (newTask, token, secureFetch) => {
  await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({ ...newTask }),
  });
};

export const editACard = async (taskId, updatedTask, token, secureFetch) => {
  await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: updatedTask.title,
      dueDate: updatedTask.dueDate || null,
    }),
  });
};
export const checkACard = async (taskId, value, token, secureFetch) => {
  await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      check: value
    }),
  });
};

export const deleteTaskOfBoard = async (taskId, token, secureFetch) => {
  await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
