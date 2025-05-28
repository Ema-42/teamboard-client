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
  console.log("Saving new task:", newTask);
  console.log("Token:", token);

  await secureFetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({ ...newTask }),
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
