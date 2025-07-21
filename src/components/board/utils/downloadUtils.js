// Modificar la función para que tome un tablero específico en lugar de todos los tableros
export const downloadBoardData = (board) => {
  // Recopilar todas las tareas del tablero específico
  const allTasks = []

  if (board.tasks && board.tasks.length > 0) {
    board.tasks.forEach((task) => {
      allTasks.push({
        title: task.title,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        boardTitle: board.title,
        check: task.check,
      })
    })
  }

  // Agrupar tareas por fecha
  const tasksByDate = {}

  allTasks.forEach((task) => {
    // Usar dueDate si existe, sino usar createdAt
    const dateToUse = task.dueDate || task.createdAt
    if (dateToUse) {
      const date = new Date(dateToUse)
      const dateKey = date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })

      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = []
      }

      tasksByDate[dateKey].push({
        title: task.title,
        boardTitle: task.boardTitle,
        check: task.check,
        time: date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })
    }
  })

  // Ordenar fechas
  const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
    const dateA = new Date(a.split(" de ").reverse().join("-"))
    const dateB = new Date(b.split(" de ").reverse().join("-"))
    return dateA - dateB // Más antiguo primero
  })

  // Generar contenido del archivo
  let content = `=== LISTADO DE ACTIVIDADES - ${board.title.toUpperCase()} ===\n\n`

  if (sortedDates.length === 0) {
    content += "No hay actividades con fechas asignadas en este tablero.\n"
  } else {
    sortedDates.forEach((date) => {
      content += `${date}:\n`

      // Ordenar tareas por hora
      const tasksForDate = tasksByDate[date].sort((a, b) => {
        return a.time.localeCompare(b.time)
      })

      tasksForDate.forEach((task) => {
        const status = task.check ? "✓" : ""
        content += `  ${status} ${task.title}`
        if (task.time) {
          content += ` (${task.time})`
        }
        content += `\n`
      })

      content += "\n"
    })
  }

  // Crear y descargar el archivo
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${board.title.replace(/[^a-zA-Z0-9]/g, "_")}_ACTIVIDADES.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
