// utils/tasksOperations.js

// Guardar la tarjeta editada
export const saveEditedCard = (boardsList, setBoardsList, editingCardId, editingCardText) => {
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
export const saveNewCard = (boardsList, setBoardsList, addingCardToBoardId, newCardText) => {
  if (addingCardToBoardId && newCardText.trim() !== "") {
    const newTask = {
      id: `task-${Date.now()}`,
      title: newCardText,
      description: "",
      color: "#37a375", // Color verde por defecto
    };

    setBoardsList(
      boardsList.map((board) =>
        board.id === addingCardToBoardId
          ? { ...board, tasks: [...(board.tasks || []), newTask] }
          : board
      )
    );
  }
};