"use client";

import { useState, useEffect, useRef } from "react";
import {
  MoreHorizontal,
  Plus,
  Trash2,
  Edit2,
  Palette,
  Save,
  Clock,
} from "lucide-react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  reorderBoards,
  deleteBoard,
  addNewBoard,
} from "./utils/boardOperations";
import { reorderTasks, moveBetweenBoards } from "./utils/tasksOperations";
import Modal from "./Modal";

const ListBoards = ({ boards = [] }) => {
  const [boardsList, setBoardsList] = useState([]);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingCardText, setEditingCardText] = useState("");
  const [editingCardDate, setEditingCardDate] = useState("");
  const [editingCardColor, setEditingCardColor] = useState("");
  const [openOptionsId, setOpenOptionsId] = useState(null);
  const [addingCardToBoardId, setAddingCardToBoardId] = useState(null);
  const [newCardText, setNewCardText] = useState("");
  const [newCardDate, setNewCardDate] = useState("");
  const [newCardColor, setNewCardColor] = useState("#d1d5db"); // Default color (gray-300)
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [editColorPickerOpen, setEditColorPickerOpen] = useState(false);
  // Estado para el modal de confirmación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ boardId: null, taskId: null });

  const optionsRef = useRef(null);
  const editTitleRef = useRef(null);
  const editCardRef = useRef(null);
  const addCardRef = useRef(null);
  const boardsContainerRef = useRef(null);
  const colorPickerRef = useRef(null);
  const editColorPickerRef = useRef(null);

  // Array of color options
  const colorOptions = [
    { name: "Yellow", value: "#fcba03" },
    { name: "Green", value: "#37a375" },
    { name: "Blue", value: "#345a8c" },
    { name: "Purple", value: "#6e3bd4" },
  ];

  // Añadir esta función después de colorOptions
  const getContrastColor = (hexColor) => {
    // Si no hay color, usar negro
    if (!hexColor) return "#000000";

    // Convertir hex a RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);

    // Calcular luminosidad
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Retornar blanco o negro según la luminosidad
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  useEffect(() => {
    if (boards && boards.length > 0) {
      const boardsWithTasks = boards.map((board) => ({
        ...board,
        tasks: board.tasks || [],
      }));
      setBoardsList(boardsWithTasks);
      console.log(boards);
    } else {
      // mostrar mensaje de sin boards
    }
  }, [boards]);

  // Manejar reordenamiento de tareas
  const handleReorderTasks = (boardId, sourceIndex, destinationIndex) => {
    // Si los índices son iguales, no hacer nada
    if (sourceIndex === destinationIndex) return;

    // Ajustar el índice de destino si es necesario
    const adjustedDestIndex =
      sourceIndex < destinationIndex ? destinationIndex - 1 : destinationIndex;

    reorderTasks(
      boardsList,
      setBoardsList,
      boardId,
      sourceIndex,
      adjustedDestIndex
    );
  };

  // Manejar movimiento entre boards
  const handleMoveBetweenBoards = (
    sourceBoardId,
    destinationBoardId,
    sourceIndex,
    destinationIndex
  ) => {
    // Si es el mismo board, usar reorderTasks
    if (sourceBoardId === destinationBoardId) {
      handleReorderTasks(sourceBoardId, sourceIndex, destinationIndex);
      return;
    }

    moveBetweenBoards(
      boardsList,
      setBoardsList,
      sourceBoardId,
      destinationBoardId,
      sourceIndex,
      destinationIndex
    );
  };

  // Guardar tarjeta editada
  const handleSaveEditedCard = () => {
    if (!editingCardId) return;

    // Encontrar el board y la tarea
    const boardIndex = boardsList.findIndex((board) =>
      board.tasks.some((task) => task.id === editingCardId)
    );

    if (boardIndex !== -1) {
      const taskIndex = boardsList[boardIndex].tasks.findIndex(
        (task) => task.id === editingCardId
      );

      if (taskIndex !== -1) {
        const newBoards = [...boardsList];
        newBoards[boardIndex].tasks[taskIndex] = {
          ...newBoards[boardIndex].tasks[taskIndex],
          title: editingCardText,
          color: editingCardColor,
          dueDate: editingCardDate,
        };

        setBoardsList(newBoards);
      }
    }

    setEditingCardId(null);
    setEditColorPickerOpen(false);
  };

  // Guardar una nueva tarjeta
  const handleSaveNewCard = () => {
    if (!addingCardToBoardId || newCardText.trim() === "") return;

    const boardIndex = boardsList.findIndex(
      (board) => board.id === addingCardToBoardId
    );

    if (boardIndex !== -1) {
      const newBoards = [...boardsList];
      newBoards[boardIndex].tasks.push({
        id: Date.now().toString(),
        title: newCardText,
        color: newCardColor,
        dueDate: newCardDate,
        check: false,
        createdAt: new Date().toISOString(),
      });

      setBoardsList(newBoards);
    }

    setAddingCardToBoardId(null);
    setNewCardText("");
    setNewCardDate("");
    setNewCardColor("#d1d5db");
    setColorPickerOpen(false);
  };

  // Togglear el estado de check de una tarea
  const toggleTaskCheck = (boardId, taskId) => {
    const boardIndex = boardsList.findIndex((board) => board.id === boardId);

    if (boardIndex !== -1) {
      const taskIndex = boardsList[boardIndex].tasks.findIndex(
        (task) => task.id === taskId
      );

      if (taskIndex !== -1) {
        const newBoards = [...boardsList];
        newBoards[boardIndex].tasks[taskIndex] = {
          ...newBoards[boardIndex].tasks[taskIndex],
          check: !newBoards[boardIndex].tasks[taskIndex].check,
        };

        setBoardsList(newBoards);
      }
    }
  };

  // Confirmar eliminación de una tarea
  const confirmDeleteTask = (boardId, taskId) => {
    setDeleteInfo({ boardId, taskId, isBoard: false });
    setDeleteModalOpen(true);
  };

  // Confirmar eliminación de un board
  const confirmDeleteBoard = (boardId) => {
    setDeleteInfo({ boardId, taskId: null, isBoard: true });
    setDeleteModalOpen(true);
    setOpenOptionsId(null);
  };

  // Eliminar una tarea
  const deleteTask = () => {
    const { boardId, taskId } = deleteInfo;
    const boardIndex = boardsList.findIndex((board) => board.id === boardId);

    if (boardIndex !== -1) {
      const newBoards = [...boardsList];
      newBoards[boardIndex].tasks = newBoards[boardIndex].tasks.filter(
        (task) => task.id !== taskId
      );

      setBoardsList(newBoards);
    }

    setDeleteModalOpen(false);
  };

  // Configurar los elementos arrastrables
  useEffect(() => {
    if (!boardsContainerRef.current) return;

    const boardElements = document.querySelectorAll(".board-container");
    const taskElements = document.querySelectorAll(".task-card");
    const taskContainers = document.querySelectorAll(".board-tasks-container");

    // Limpiar funciones anteriores
    const cleanupFunctions = [];

    // Hacer los boards arrastrables
    boardElements.forEach((element, index) => {
      const boardId = boardsList[index]?.id;
      if (!boardId) return;

      const cleanup = draggable({
        element,
        data: { type: "board", id: boardId, index },
        onDragStart: () => {
          element.classList.add("opacity-70", "scale-105", "shadow-lg", "z-50");
          setDraggedItem({ type: "board", id: boardId, index });
        },
        onDrag: () => {
          // Espacio para animaciones adicionales si se desean
        },
        onDrop: () => {
          element.classList.remove(
            "opacity-70",
            "scale-105",
            "shadow-lg",
            "z-50"
          );
          setDraggedItem(null);
          setDropTarget(null);
        },
      });

      cleanupFunctions.push(cleanup);
    });

    // Hacer las tareas arrastrables
    taskElements.forEach((element) => {
      // Obtener el taskId y boardId
      const taskId = element.getAttribute("data-task-id");
      const boardId = element.getAttribute("data-board-id");
      const boardIndex = boardsList.findIndex((b) => b.id === boardId);
      const taskIndex = boardsList[boardIndex]?.tasks.findIndex(
        (t) => t.id === taskId
      );

      if (boardIndex === -1 || taskIndex === -1) return;

      const cleanup = draggable({
        element,
        data: {
          type: "task",
          taskId,
          boardId,
          taskIndex,
          boardIndex,
        },
        onDragStart: () => {
          element.classList.add("opacity-70", "scale-105", "shadow-lg", "z-50");
          setDraggedItem({
            type: "task",
            taskId,
            boardId,
            taskIndex,
            boardIndex,
          });
        },
        onDrop: () => {
          element.classList.remove(
            "opacity-70",
            "scale-105",
            "shadow-lg",
            "z-50"
          );
          setDraggedItem(null);
          setDropTarget(null);
        },
      });

      cleanupFunctions.push(cleanup);
    });

    // Hacer que los boards sean destinos de drop para otros boards
    boardElements.forEach((element, index) => {
      const boardId = boardsList[index]?.id;
      if (!boardId) return;

      const cleanup = dropTargetForElements({
        element,
        getData: () => ({ type: "board", id: boardId, index }),
        onDragEnter: (action) => {
          if (!draggedItem) return;

          // Solo permitir drop de boards en boards
          if (draggedItem.type === "board") {
            element.classList.add("bg-gray-700", "border-teal-500", "border-2");
            setDropTarget({ type: "board", id: boardId, index });
          }
        },
        onDragLeave: () => {
          element.classList.remove(
            "bg-gray-700",
            "border-teal-500",
            "border-2"
          );
          setDropTarget(null);
        },
        onDrop: (action) => {
          element.classList.remove(
            "bg-gray-700",
            "border-teal-500",
            "border-2"
          );

          if (!draggedItem) return;

          // Reordenar boards
          if (draggedItem.type === "board" && draggedItem.index !== index) {
            handleReorderBoards(draggedItem.index, index);
          }

          setDropTarget(null);
        },
      });

      cleanupFunctions.push(cleanup);
    });

    // Hacer que los contenedores de tareas sean destinos de drop
    taskContainers.forEach((element, index) => {
      const boardId = boardsList[index]?.id;
      if (!boardId) return;

      const cleanup = dropTargetForElements({
        element,
        getData: () => ({ type: "taskContainer", boardId, index }),
        onDragEnter: () => {
          if (!draggedItem) return;

          // Permitir drop de tareas en contenedores de tareas
          if (draggedItem.type === "task") {
            element.classList.add(
              "bg-gray-700",
              "border-dashed",
              "border-teal-500",
              "border-2"
            );
            setDropTarget({ type: "taskContainer", boardId, index });
          }
        },
        onDragLeave: () => {
          element.classList.remove(
            "bg-gray-700",
            "border-dashed",
            "border-teal-500",
            "border-2"
          );
          setDropTarget(null);
        },
        onDrop: () => {
          element.classList.remove(
            "bg-gray-700",
            "border-dashed",
            "border-teal-500",
            "border-2"
          );

          if (!draggedItem || draggedItem.type !== "task") return;

          // Si la tarea es del mismo board, moverla al final
          if (draggedItem.boardId === boardId) {
            const boardIndex = boardsList.findIndex((b) => b.id === boardId);
            const taskCount = boardsList[boardIndex]?.tasks?.length || 0;
            handleReorderTasks(boardId, draggedItem.taskIndex, taskCount - 1);
          } else {
            // Mover tarea entre boards (al final del board destino)
            const destBoardIndex = boardsList.findIndex(
              (b) => b.id === boardId
            );
            const destTaskCount =
              boardsList[destBoardIndex]?.tasks?.length || 0;
            handleMoveBetweenBoards(
              draggedItem.boardId,
              boardId,
              draggedItem.taskIndex,
              destTaskCount
            );
          }

          setDropTarget(null);
        },
      });

      cleanupFunctions.push(cleanup);
    });

    // Hacer que cada tarea sea también un destino de drop para otras tareas
    taskElements.forEach((element) => {
      const taskId = element.getAttribute("data-task-id");
      const boardId = element.getAttribute("data-board-id");
      const boardIndex = boardsList.findIndex((b) => b.id === boardId);
      const taskIndex = boardsList[boardIndex]?.tasks.findIndex(
        (t) => t.id === taskId
      );

      if (boardIndex === -1 || taskIndex === -1) return;

      const cleanup = dropTargetForElements({
        element,
        getData: () => ({
          type: "task",
          taskId,
          boardId,
          taskIndex,
          boardIndex,
        }),
        onDragEnter: () => {
          if (
            !draggedItem ||
            draggedItem.type !== "task" ||
            draggedItem.taskId === taskId
          )
            return;

          // Añadir indicador visual más claro
          element.classList.add("border-2", "border-teal-500");

          // Determinar si insertar antes o después basado en la posición del mouse
          const rect = element.getBoundingClientRect();
          const mouseY = window.event.clientY;
          const insertBefore = mouseY < rect.top + rect.height / 2;

          // Añadir indicador visual en la parte superior o inferior
          if (insertBefore) {
            element.classList.add("border-t-4", "border-t-teal-500");
            element.style.borderTopColor = "rgb(20, 184, 166)";
            element.style.borderTopWidth = "4px";
          } else {
            element.classList.add("border-b-4", "border-b-teal-500");
            element.style.borderBottomColor = "rgb(20, 184, 166)";
            element.style.borderBottomWidth = "4px";
          }

          setDropTarget({
            type: "task",
            taskId,
            boardId,
            taskIndex,
            boardIndex,
            insertBefore,
          });
        },
        onDragLeave: () => {
          element.classList.remove(
            "border-teal-500",
            "border-2",
            "border-t-4",
            "border-b-4"
          );
          element.style.borderTopWidth = "";
          element.style.borderTopColor = "";
          element.style.borderBottomWidth = "";
          element.style.borderBottomColor = "";
          setDropTarget(null);
        },
        onDrop: () => {
          element.classList.remove(
            "border-teal-500",
            "border-2",
            "border-t-4",
            "border-b-4"
          );
          element.style.borderTopWidth = "";
          element.style.borderTopColor = "";
          element.style.borderBottomWidth = "";
          element.style.borderBottomColor = "";

          if (
            !draggedItem ||
            draggedItem.type !== "task" ||
            draggedItem.taskId === taskId
          )
            return;

          // Si la tarea es del mismo board, reordenarla
          if (draggedItem.boardId === boardId) {
            // Ajustar el índice de destino basado en si se inserta antes o después
            const adjustedIndex =
              dropTarget && dropTarget.insertBefore ? taskIndex : taskIndex + 1;
            handleReorderTasks(boardId, draggedItem.taskIndex, adjustedIndex);
          } else {
            // Mover tarea entre boards
            const adjustedIndex =
              dropTarget && dropTarget.insertBefore ? taskIndex : taskIndex + 1;
            handleMoveBetweenBoards(
              draggedItem.boardId,
              boardId,
              draggedItem.taskIndex,
              adjustedIndex
            );
          }

          setDropTarget(null);
        },
      });

      cleanupFunctions.push(cleanup);
    });

    // Limpiar todas las funciones al desmontar
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [boardsList, draggedItem]);

  // Manejar clics fuera de los elementos editables
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar menú de opciones
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenOptionsId(null);
      }
      // Guardar título del board si se está editando
      if (
        editTitleRef.current &&
        !editTitleRef.current.contains(event.target)
      ) {
        saveEditedTitle();
      }
      // Guardar texto de la tarjeta si se está editando
      if (
        editingCardId &&
        editCardRef.current &&
        !editCardRef.current.contains(event.target) &&
        !event.target.closest(".edit-color-picker-toggle") &&
        !event.target.closest(".card-edit-controls")
      ) {
        handleSaveEditedCard();
      }

      // Guardar nueva tarjeta si se está agregando o cerrar si se hace clic fuera
      if (
        addingCardToBoardId &&
        addCardRef.current &&
        !addCardRef.current.contains(event.target) &&
        !event.target.closest(".color-picker-toggle") &&
        !event.target.closest(".new-card-controls")
      ) {
        if (newCardText.trim() !== "") {
          handleSaveNewCard();
        } else {
          setAddingCardToBoardId(null);
        }
      }

      // Cerrar color picker
      if (
        colorPickerOpen &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target) &&
        !event.target.closest(".color-picker-toggle")
      ) {
        setColorPickerOpen(false);
      }

      // Cerrar color picker de edición
      if (
        editColorPickerOpen &&
        editColorPickerRef.current &&
        !editColorPickerRef.current.contains(event.target) &&
        !event.target.closest(".edit-color-picker-toggle")
      ) {
        setEditColorPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    editingBoardId,
    editingCardId,
    addingCardToBoardId,
    editingTitle,
    editingCardText,
    newCardText,
    editingCardColor,
    editingCardDate,
    newCardColor,
    newCardDate,
  ]);

  // Manejar la edición del título del board
  const handleEditBoard = (board) => {
    // Solo permitir editar un elemento a la vez
    setEditingCardId(null);
    setAddingCardToBoardId(null);

    setEditingBoardId(board.id);
    setEditingTitle(board.title);
    setOpenOptionsId(null);
  };

  // Guardar el título editado
  const saveEditedTitle = () => {
    if (editingBoardId && editingTitle.trim() !== "") {
      setBoardsList(
        boardsList.map((board) =>
          board.id === editingBoardId
            ? { ...board, title: editingTitle }
            : board
        )
      );
    }
    setEditingBoardId(null);
  };

  // Manejar la edición de una tarjeta
  const handleEditCard = (boardId, task) => {
    // Solo permitir editar un elemento a la vez
    setEditingBoardId(null);
    setAddingCardToBoardId(null);

    setEditingCardId(task.id);
    setEditingCardText(task.title);
    setEditingCardColor(task.color || "#d1d5db");

    // Formatear la fecha para el input datetime-local
    if (task.dueDate) {
      // Convertir la fecha a formato ISO y extraer solo la parte de fecha y hora
      const date = new Date(task.dueDate);
      const formattedDate = date.toISOString().slice(0, 16);
      setEditingCardDate(formattedDate);
    } else {
      setEditingCardDate("");
    }
  };

  // Iniciar la adición de una nueva tarjeta
  const startAddCard = (boardId) => {
    // Solo permitir editar un elemento a la vez
    setEditingBoardId(null);
    setEditingCardId(null);

    setAddingCardToBoardId(boardId);
    setNewCardText("");
    setNewCardDate("");
    setNewCardColor("#d1d5db");
  };

  // Manejar tecla Enter en campos editables
  const handleKeyDown = (e, saveFunction) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveFunction();
    }
  };

  const adjustTextareaHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleReorderBoards = (sourceIndex, destinationIndex) => {
    reorderBoards(boardsList, setBoardsList, sourceIndex, destinationIndex);
  };

  const handleDeleteBoard = () => {
    const { boardId } = deleteInfo;
    deleteBoard(boardsList, setBoardsList, boardId, setOpenOptionsId);
    setDeleteModalOpen(false);
  };

  const handleAddNewBoard = () => {
    addNewBoard(boardsList, setBoardsList);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Función para manejar la confirmación del modal
  const handleModalConfirm = () => {
    if (deleteInfo.isBoard) {
      handleDeleteBoard();
    } else {
      deleteTask();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddNewBoard}
          className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-400 dark:hover:bg-teal-500 dark:text-black px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Tablero
        </button>
      </div>

      <div ref={boardsContainerRef} className="flex flex-wrap gap-4">
        {boardsList.map((board) => (
          <div
            key={board.id}
            className="board-container bg-gray-300 dark:bg-gray-700 rounded-md shadow-lg w-80 flex flex-col transition-all duration-200"
          >
            {/* Cabecera del board */}
            <div className="p-3 flex justify-between items-center">
              {editingBoardId === board.id ? (
                <input
                  ref={editTitleRef}
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, saveEditedTitle)}
                  className="bg-gray-300 text-black dark:bg-gray-600 dark:text-white px-2 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              ) : (
                <div className="flex flex-col">
                  <h3
                    className="font-medium text-black dark:text-white cursor-pointer hover:text-teal-500 dark:hover:text-teal-300"
                    onClick={() => handleEditBoard(board)}
                  >
                    {board.title}
                  </h3>
                  {board.createdAt && (
                    <span className="text-xs text-gray-700 dark:text-gray-400">
                      Creado: {formatDate(board.createdAt)}
                    </span>
                  )}
                </div>
              )}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenOptionsId(
                      openOptionsId === board.id ? null : board.id
                    )
                  }
                  className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400"
                >
                  <MoreHorizontal size={18} />
                </button>

                {openOptionsId === board.id && (
                  <div
                    ref={optionsRef}
                    className="absolute right-0 mt-1 w-48 bg-gray-200 dark:bg-gray-700 rounded-md shadow-lg z-10"
                  >
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => handleEditBoard(board)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
                        >
                          <Edit2 size={14} className="mr-2" />
                          Renombrar
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => confirmDeleteBoard(board.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Eliminar
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido del board */}
            <div className="board-tasks-container p-2 flex-grow overflow-y-auto max-h-[calc(100vh-200px)] relative">
              {/* Indicador de posición de drop para tareas */}
              {draggedItem &&
                draggedItem.type === "task" &&
                dropTarget &&
                dropTarget.boardId === board.id && (
                  <div
                    className="absolute left-0 right-0 h-1 bg-teal-500 z-10 rounded-full"
                    style={{
                      top:
                        dropTarget.type === "taskContainer"
                          ? "100%"
                          : dropTarget.insertBefore
                          ? "0"
                          : "100%",
                    }}
                  ></div>
                )}

              {board.tasks &&
                board.tasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    data-task-id={task.id}
                    data-board-id={board.id}
                    className={`task-card mb-2 rounded-md p-2 transition-all duration-200 relative ${
                      task.color
                        ? ""
                        : "bg-gray-600 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                    style={{ backgroundColor: task.color || "" }}
                  >
                    {editingCardId === task.id ? (
                      <div ref={editCardRef} className="w-full">
                        <textarea
                          value={editingCardText}
                          onChange={(e) => {
                            setEditingCardText(e.target.value);
                            adjustTextareaHeight(e);
                          }}
                          onKeyDown={(e) =>
                            handleKeyDown(e, handleSaveEditedCard)
                          }
                          className="w-full bg-transparent border border-gray-400 dark:border-gray-600 rounded p-1 text-sm resize-none min-h-[60px] focus:outline-none focus:border-teal-500"
                          style={{ backgroundColor: editingCardColor }}
                          autoFocus
                        />
                        <div className="flex justify-between items-center mt-2 card-edit-controls">
                          <div className="flex items-center space-x-2">
                            <input
                              type="datetime-local"
                              value={editingCardDate}
                              onChange={(e) =>
                                setEditingCardDate(e.target.value)
                              }
                              className="p-1 text-xs rounded border border-gray-400 bg-transparent"
                              style={{ backgroundColor: editingCardColor }}
                            />

                            <button
                              onClick={() =>
                                setEditColorPickerOpen(!editColorPickerOpen)
                              }
                              className="p-3 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 edit-color-picker-toggle"
                              style={{
                                backgroundColor:
                                  getContrastColor(editingCardColor),
                              }}
                            ></button>
                          </div>

                          <button
                            onClick={handleSaveEditedCard}
                            className="bg-teal-500 text-white p-1 rounded hover:bg-teal-600"
                          >
                            <Save size={16} />
                          </button>
                        </div>

                        {/* Selector de colores en línea */}
                        {editColorPickerOpen && (
                          <div
                            ref={editColorPickerRef}
                            className="flex flex-row space-x-1 mt-2 p-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
                          >
                            {colorOptions.map((color) => (
                              <div
                                key={color.value}
                                className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: color.value }}
                                onClick={() => setEditingCardColor(color.value)}
                                title={color.name}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <button
                          onClick={() => toggleTaskCheck(board.id, task.id)}
                          className="mr-2 flex-shrink-0 p-1"
                        >
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              task.check
                                ? "bg-green-500 border-green-600"
                                : "bg-white dark:bg-gray-700 border-gray-400 dark:border-gray-500"
                            }`}
                          >
                            {task.check && (
                              <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                            )}
                          </div>
                        </button>
                        <div
                          onClick={() => handleEditCard(board.id, task)}
                          className="cursor-pointer hover:bg-opacity-80 flex-grow"
                        >
                          <p
                            className={`text-sm font-medium p-1 ${
                              task.check ? "line-through text-opacity-60" : ""
                            }`}
                          >
                            <span className="px-2 py-1 bg-black/10 rounded-md text-white">
                              {task.title}
                            </span>

                            {/* Mostrar mensaje de vencido si la tarea no está completada y la fecha ya pasó */}
                            {!task.check &&
                              task.dueDate &&
                              new Date(task.dueDate) < new Date() && (
                                <span className="ml-2 px-2 py-1 bg-red-600 text-white rounded-md text-xs">
                                  Vencido
                                </span>
                              )}
                          </p>

                          {task.dueDate && (
                            <div className="flex items-center mt-1 text-xs opacity-75">
                              <Clock size={12} className="mr-1" />
                              <span className="bg-black/30 rounded-md text-white">
                                {formatDate(task.dueDate)}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => confirmDeleteTask(board.id, task.id)}
                          className="ml-2 p-1 rounded-md hover:bg-red-500 hover:bg-opacity-20 flex-shrink-0 cursor-pointer"
                        >
                          <Trash2 size={14} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Pie del board */}
            <div className="p-2 border-t border-gray-300 dark:border-gray-600">
              {addingCardToBoardId === board.id ? (
                <div ref={addCardRef} className="w-full">
                  <textarea
                    value={newCardText}
                    onChange={(e) => {
                      setNewCardText(e.target.value);
                      adjustTextareaHeight(e);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, handleSaveNewCard)}
                    placeholder="Ingrese el texto de la tarjeta..."
                    className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded p-2 text-sm resize-none min-h-[60px] text-black dark:text-white focus:outline-none focus:border-teal-500"
                    autoFocus
                  />

                  <div className="flex justify-between items-center mt-2 new-card-controls">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        value={newCardDate}
                        onChange={(e) => setNewCardDate(e.target.value)}
                        className="p-1 text-xs rounded border border-gray-400 bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                      />

                      <button
                        onClick={() => setColorPickerOpen(!colorPickerOpen)}
                        className="p-3 rounded-sm dark:hover:bg-gray-600 color-picker-toggle"
                        style={{ backgroundColor: newCardColor }}
                      ></button>
                    </div>

                    <button
                      onClick={handleSaveNewCard}
                      className="bg-teal-500 text-white p-1 rounded hover:bg-teal-600"
                    >
                      <Save size={16} />
                    </button>
                  </div>

                  {/* Selector de colores en línea */}
                  {colorPickerOpen && (
                    <div
                      ref={colorPickerRef}
                      className="flex flex-row space-x-1 mt-2 p-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
                    >
                      {colorOptions.map((color) => (
                        <div
                          key={color.value}
                          className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.value }}
                          onClick={() => setNewCardColor(color.value)}
                          title={color.name}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => startAddCard(board.id)}
                  className="w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add a card
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleModalConfirm}
        title={deleteInfo.isBoard ? "Eliminar Tablero" : "Eliminar Tarjeta"}
        message={
          deleteInfo.isBoard
            ? "¿Estás seguro de que deseas eliminar este tablero? Esta acción no se puede deshacer."
            : "¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer."
        }
      />
    </div>
  );
};

export default ListBoards;
