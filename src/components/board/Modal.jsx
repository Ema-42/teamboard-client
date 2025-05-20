"use client"

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-xl">
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
          >
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
