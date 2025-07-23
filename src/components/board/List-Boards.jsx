"use client";
import { useState, useEffect, useRef } from "react";
import "./styles/styles.css";
import {
  Plus,
  Trash2,
  X,
  Users,
  CheckCircle,
  Circle,
  Download,
  AlarmClockCheck,
} from "lucide-react";
import { deleteBoard, addNewBoard, editBoard } from "./utils/boardOperations";
import Modal from "./Modal";
import { useSecureFetch } from "../../hooks/useSecureFetch";
import { useAuth } from "../../context/AuthContext";
import {
  checkACard,
  deleteTaskOfBoard,
  editACard,
  saveNewCard,
} from "./utils/tasksOperations";
import ToolTipOwner from "./ToolTipOwner";
import SharedBoard from "./ModalSharedBoardWithUsers";
import ToolTip from "./ToolTipMembers";
import UserAuthorTask from "./UserAuthorTask";
import { downloadBoardData } from "./utils/downloadUtils";

const ListBoards = ({ boards = [] }) => {
  const [boardsList, setBoardsList] = useState([]);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingCardText, setEditingCardText] = useState("");
  const [editingCardDate, setEditingCardDate] = useState("");
  const [openOptionsId, setOpenOptionsId] = useState(null);
  const [addingCardToBoardId, setAddingCardToBoardId] = useState(null);
  const [newCardText, setNewCardText] = useState("");
  const [newCardDate, setNewCardDate] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ boardId: null, taskId: null });
  const optionsRef = useRef(null);
  const editTitleRef = useRef(null);
  const editCardRef = useRef(null);
  const addCardRef = useRef(null);
  const newCardTextareaRef = useRef(null);
  const { secureFetch } = useSecureFetch();
  const { token, user } = useAuth();

  useEffect(() => {
    if (boards && boards.length > 0) {
      const boardsWithTasks = boards.map((board) => ({
        ...board,
        tasks: board.tasks || [],
      }));
      setBoardsList(boardsWithTasks);
    }
  }, [boards]);

  // Función para manejar la descarga de un tablero específico
  const handleDownload = (board) => {
    downloadBoardData(board);
  };

  // Función para cancelar la edición de tarjeta
  const cancelEditCard = () => {
    setEditingCardId(null);
    setEditingCardText("");
    setEditingCardDate("");
  };

  // Función para cancelar agregar nueva tarjeta
  const cancelAddCard = () => {
    setAddingCardToBoardId(null);
    setNewCardText("");
    setNewCardDate("");
  };

  const handleSaveEditedCard = () => {
    if (!editingCardId) return;
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
          dueDate: editingCardDate,
        };
        const newEditedTask = {
          title: editingCardText,
          dueDate: editingCardDate,
        };
        editACard(editingCardId, newEditedTask, token, secureFetch);
        setBoardsList(newBoards);
      }
    }
    setEditingCardId(null);
  };

  const handleSaveNewCard = () => {
    if (!addingCardToBoardId || newCardText.trim() === "") return;
    const boardIndex = boardsList.findIndex(
      (board) => board.id === addingCardToBoardId
    );
    if (boardIndex !== -1) {
      const newBoards = [...boardsList];
      const newTask = {
        title: newCardText,
        dueDate: newCardDate || null,
        board_id: addingCardToBoardId,
        created_by: user.id,
      };
      newBoards[boardIndex].tasks.push({
        id: Date.now().toString(),
        title: newCardText,
        dueDate: newCardDate,
        check: false,
        createdAt: new Date().toISOString(),
      });
      //guardar en bd
      saveNewCard(newTask, token, secureFetch);
      setBoardsList(newBoards);
    }
    // Limpiar los campos pero mantener el formulario abierto
    setNewCardText("");
    setNewCardDate("");
    // Mantener el focus en el textarea para continuar agregando tareas
    if (newCardTextareaRef.current) {
      newCardTextareaRef.current.focus();
      // Resetear la altura del textarea
      newCardTextareaRef.current.style.height = "auto";
    }
  };

  const toggleTaskCheck = (boardId, taskId, taskCheck) => {
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
        checkACard(taskId, !taskCheck, token, secureFetch);
      }
    }
  };

  const confirmDeleteTask = (boardId, taskId) => {
    setDeleteInfo({ boardId, taskId, isBoard: false });
    setDeleteModalOpen(true);
  };

  const confirmDeleteBoard = (boardId) => {
    setDeleteInfo({ boardId, taskId: null, isBoard: true });
    setDeleteModalOpen(true);
    setOpenOptionsId(null);
  };

  const deleteTask = () => {
    const { boardId, taskId } = deleteInfo;
    const boardIndex = boardsList.findIndex((board) => board.id === boardId);
    if (boardIndex !== -1) {
      const newBoards = [...boardsList];
      newBoards[boardIndex].tasks = newBoards[boardIndex].tasks.filter(
        (task) => task.id !== taskId
      );
      deleteTaskOfBoard(taskId, token, secureFetch);
      setBoardsList(newBoards);
    }
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenOptionsId(null);
      }
      if (
        editTitleRef.current &&
        !editTitleRef.current.contains(event.target)
      ) {
        saveEditedTitle();
      }
      if (
        editingCardId &&
        editCardRef.current &&
        !editCardRef.current.contains(event.target)
      ) {
        handleSaveEditedCard();
      }
      if (
        addingCardToBoardId &&
        addCardRef.current &&
        !addCardRef.current.contains(event.target)
      ) {
        if (newCardText.trim() !== "") {
          handleSaveNewCard();
        } else {
          setAddingCardToBoardId(null);
        }
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
    editingCardDate,
    newCardDate,
  ]);

  const handleEditBoard = (board) => {
    setEditingCardId(null);
    setAddingCardToBoardId(null);
    setEditingBoardId(board.id);
    setEditingTitle(board.title);
    setOpenOptionsId(null);
  };

  const saveEditedTitle = () => {
    if (editingBoardId && editingTitle.trim() !== "") {
      console.log("Saving edited title:", editingTitle);
      //guardar en bd
      editBoard(editingBoardId, token, editingTitle, secureFetch);
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

  const handleEditCard = (boardId, task) => {
    setEditingBoardId(null);
    setAddingCardToBoardId(null);
    setEditingCardId(task.id);
    setEditingCardText(task.title);
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      const formattedDate = date.toISOString().slice(0, 16);
      setEditingCardDate(formattedDate);
    } else {
      setEditingCardDate("");
    }
  };

  const startAddCard = (boardId) => {
    setEditingBoardId(null);
    setEditingCardId(null);
    setAddingCardToBoardId(boardId);
    setNewCardText("");
    setNewCardDate(""); // Fecha vacía por defecto
  };

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

  const handleDeleteBoard = () => {
    const { boardId } = deleteInfo;
    deleteBoard(
      boardsList,
      setBoardsList,
      boardId,
      setOpenOptionsId,
      token,
      secureFetch
    );
    setDeleteModalOpen(false);
  };

  const handleAddNewBoard = () => {
    addNewBoard(boardsList, setBoardsList, secureFetch, user, token);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleModalConfirm = () => {
    if (deleteInfo.isBoard) {
      handleDeleteBoard();
    } else {
      deleteTask();
    }
  };

  const [sharedBoardOpen, setSharedBoardOpen] = useState(false);
  const [selectedBoardToShare, setSelectedBoardToShare] = useState(null);

  const handleShareBoard = (board) => {
    setSelectedBoardToShare(board);
    setSharedBoardOpen(true);
  };

  const formatDateDay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("es-ES", { month: "short" });
    return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden relative">
      {/* Contenido principal sin el botón del header */}
      <div
        className="flex gap-4 items-start px-4 pb-4 pt-4 flex-1 min-h-0 overflow-x-auto overflow-y-hidden boards-scroll"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#374151 #1f2937",
        }}
      >
        {boardsList.map((board) => (
          <div
            key={board.id}
            className={`bg-white dark:bg-gray-950/40 border-b-1 rounded-md shadow-lg 
            w-full sm:w-80 flex-shrink-0 flex flex-col border-t-4 h-full
            transition-shadow duration-200 cursor-pointer
            ${
              board.ownerId === user.id
                ? "border-teal-500 hover:shadow-teal-500/30 hover:shadow-xl"
                : "border-amber-400 hover:shadow-amber-400/30 hover:shadow-xl"
            }`}
          >
            <div className="p-3 flex justify-between items-center flex-shrink-0">
              {editingBoardId === board.id ? (
                <input
                  ref={editTitleRef}
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, saveEditedTitle)}
                  className="bg-gray-300 text-black dark:bg-gray-600  dark:text-white px-2 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              ) : (
                <div className="flex flex-col w-full">
                  <div className="flex items-start justify-between mb-2.5 w-full">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="relative group">
                        {board.ownerId !== user.id && (
                          <ToolTipOwner board={board} user={user} />
                        )}
                      </div>
                      <h3
                        className="font-medium text-black  dark:text-white cursor-pointer hover:text-teal-500 dark:hover:text-teal-300 truncate"
                        onClick={() => handleEditBoard(board)}
                      >
                        {board.title}
                      </h3>
                    </div>
                    {/* Botones de acción pegados al extremo derecho */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleShareBoard(board)}
                        className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/60 transition-colors duration-200 flex items-center justify-center"
                        title="Compartir tablero"
                      >
                        <Users size={18} />
                      </button>
                      <button
                        onClick={() => handleDownload(board)}
                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors duration-200 flex items-center justify-center"
                        title="Descargar tareas del tablero"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => confirmDeleteBoard(board.id)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors duration-200 flex items-center justify-center"
                        title="Eliminar tablero"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {board.createdAt && (
                    <span className="text-xs text-gray-700 dark:text-gray-400">
                      Creado: {formatDate(board.createdAt)}{" "}
                      {board.ownerId !== user.id && `por ${board.owner?.name} `}
                    </span>
                  )}
                  {board.members && board.members.length > 0 && (
                    <ToolTip users={board.members} />
                  )}
                </div>
              )}
            </div>
            <div
              className="p-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden tasks-scroll"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#374151 #1f2937",
              }}
            >
              {board.tasks &&
                board.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`mb-2 rounded-md p-0 relative border border-transparent hover:border-white/40   ${
                      task.check
                        ? "bg-green-300 dark:bg-teal-700/50"
                        : "bg-gray-300 dark:bg-gray-700"
                    } `}
                  >
                    {editingCardId === task.id ? (
                      <div ref={editCardRef} className="w-full p-2">
                        <textarea
                          value={editingCardText}
                          onChange={(e) => {
                            setEditingCardText(e.target.value);
                            adjustTextareaHeight(e);
                          }}
                          onKeyDown={(e) =>
                            handleKeyDown(e, handleSaveEditedCard)
                          }
                          className="w-full bg-transparent border border-gray-400 dark:border-gray-600 rounded p-1 text-sm resize-none    focus:outline-none focus:border-teal-500 text-gray-800 dark:text-white"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <input
                            type="datetime-local"
                            value={editingCardDate}
                            onChange={(e) => setEditingCardDate(e.target.value)}
                            className="flex-1 h-10 p-1 text-xs rounded border border-gray-400 bg-transparent text-gray-800 dark:text-white"
                          />
                          <button
                            onClick={handleSaveEditedCard}
                            className="flex-1 h-10 bg-teal-500 text-white px-2 py-2 rounded hover:bg-teal-600 text-xs"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelEditCard}
                            className="w-10 h-10 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-stretch">
                        <div
                          className="flex-grow p-2 hover:bg-black/10 transition-colors duration-200 cursor-pointer"
                          onClick={() => handleEditCard(board.id, task)}
                        >
                          <div className="flex items-start">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskCheck(board.id, task.id, task.check);
                              }}
                              className="mr-2 flex-shrink-0 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                              aria-label={
                                task.check
                                  ? "Marcar tarea como incompleta"
                                  : "Marcar tarea como completa"
                              }
                            >
                              {task.check ? (
                                <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-500" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </button>
                            <div className="flex-grow">
                              <div className="flex items-center text-sm font-medium p-1">
                                <div className="w-40 break-words">
                                  <label
                                    className={`py-1 text-gray-800 dark:text-white `}
                                  >
                                    {task.title}
                                  </label>
                                </div>
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center mt-1 text-xs">
                                  <AlarmClockCheck
                                    size={12}
                                    className="mr-1 text-gray-800 dark:text-white"
                                  />
                                  <span className="px-1   text-gray-900 dark:text-white">
                                    {formatDate(task.dueDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="px-1 text-gray-500 dark:text-gray-400 text-[11px]">
                            Creado el {formatDateDay(task.createdAt)}
                          </span>
                        </div>
                        {(board?.ownerId !== user.id ||
                          board?.members?.length > 0) && (
                          <UserAuthorTask
                            task={task}
                            members={board.members}
                            owner={user}
                          />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteTask(board.id, task.id);
                          }}
                          className="w-[50px] bg-gray-800/20 hover:bg-red-500/100 transition-colors duration-200 flex items-center justify-center rounded-r-md"
                          style={{ minHeight: "100%" }}
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <div className="p-2 border-t border-gray-300 dark:border-gray-600 flex-shrink-0">
              {addingCardToBoardId === board.id ? (
                <div ref={addCardRef} className="w-full">
                  <textarea
                    ref={newCardTextareaRef}
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
                  <div className="flex gap-2 mt-2">
                    <input
                      type="datetime-local"
                      value={newCardDate}
                      onChange={(e) => setNewCardDate(e.target.value)}
                      placeholder="Fecha opcional"
                      className="flex-1 h-10 p-2 text-xs rounded border border-gray-400 bg-gray-400 dark:bg-gray-700 text-black dark:text-white"
                    />
                    <button
                      onClick={handleSaveNewCard}
                      className="flex-1 h-10 bg-teal-700 text-white rounded hover:bg-teal-800 text-xs"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelAddCard}
                      className="w-10 h-10 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center "
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startAddCard(board.id)}
                  className=" cursor-pointer w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Agregar Tarjeta
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botón flotante */}
      <button
        onClick={handleAddNewBoard}
        className="fixed bottom-6 right-6 z-50 group
    w-12 h-12 md:hover:w-auto md:hover:px-4
    bg-teal-600 hover:bg-teal-700 
    text-white rounded-full 
    shadow-lg  
    transition-all duration-600 ease-in-out
    flex items-center justify-center
    border-2 border-teal-500 hover:border-teal-400
    animate-pulse-glow cursor-pointer"
        title="Agregar tablero"
      >
        <Plus size={25} className="flex-shrink-0" />
        <span className="hidden md:group-hover:inline-block ml-2 whitespace-nowrap text-sm font-medium">
          Agregar tablero
        </span>
      </button>

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
      {sharedBoardOpen && selectedBoardToShare && (
        <SharedBoard
          secureFetch={secureFetch}
          board={selectedBoardToShare}
          onClose={() => setSharedBoardOpen(false)}
          onShare={() => setSharedBoardOpen(false)}
        />
      )}
      <style jsx>{`
        .boards-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .boards-scroll::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .boards-scroll::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        .boards-scroll::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
        .tasks-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .tasks-scroll::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .tasks-scroll::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .tasks-scroll::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default ListBoards;
