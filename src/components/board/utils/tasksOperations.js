// utils/tasksOperations.js

// Reordenar tareas dentro del mismo board usando Swapy
export const reorderTasks = (boardsList, setBoardsList, boardId, sourceIndex, destinationIndex) => {
  const updatedBoards = boardsList.map((board) => {
    if (board.id === boardId) {
      const newTasks = Array.from(board.tasks || []);
      const [removed] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destinationIndex, 0, removed);
      return { ...board, tasks: newTasks };
    }
    return board;
  });
  setBoardsList(updatedBoards);
};

// Mover tarea entre boards
export const moveBetweenBoards = (
  boardsList,
  setBoardsList,
  sourceBoardId,
  destinationBoardId,
  sourceIndex,
  destinationIndex
) => {
  const sourceBoard = boardsList.find((board) => board.id === sourceBoardId);
  const destBoard = boardsList.find((board) => board.id === destinationBoardId);

  if (!sourceBoard || !destBoard) return;

  const newSourceTasks = Array.from(sourceBoard.tasks || []);
  const [movedTask] = newSourceTasks.splice(sourceIndex, 1);

  const newDestTasks = Array.from(destBoard.tasks || []);
  newDestTasks.splice(destinationIndex, 0, movedTask);

  const updatedBoards = boardsList.map((board) => {
    if (board.id === sourceBoardId) {
      return { ...board, tasks: newSourceTasks };
    }
    if (board.id === destinationBoardId) {
      return { ...board, tasks: newDestTasks };
    }
    return board;
  });

  setBoardsList(updatedBoards);
};

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
      color: "green",
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

// Manejar el evento de swap de Swapy para tareas
export const handleTaskSwap = (boardsList, setBoardsList, swapEvent) => {
  const { 
    fromSlot, 
    toSlot, 
    fromIndex, 
    toIndex 
  } = swapEvent.data;
  
  // Extraer board IDs de los slots
  const sourceBoardId = fromSlot.replace('board-', '');
  const destinationBoardId = toSlot.replace('board-', '');
  
  if (sourceBoardId === destinationBoardId) {
    // Reordenar dentro del mismo board
    reorderTasks(boardsList, setBoardsList, sourceBoardId, fromIndex, toIndex);
  } else {
    // Mover entre boards diferentes
    moveBetweenBoards(
      boardsList, 
      setBoardsList, 
      sourceBoardId, 
      destinationBoardId, 
      fromIndex, 
      toIndex
    );
  }
};