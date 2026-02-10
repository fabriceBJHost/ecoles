import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)

    contextBridge.exposeInMainWorld('auth', {
      login: (formData) => ipcRenderer.invoke('login', formData)
    })

    /**
     * Api Users
     */
    contextBridge.exposeInMainWorld('users', {
      getUsers: (formData) => ipcRenderer.invoke('getLocalUsers', formData),
      getOneUsers: (formData) => ipcRenderer.invoke('getOneUsers', formData),
      deleteUsers: (formData) => ipcRenderer.invoke('deleteUsers', formData),
      updateUsers: (formData) => ipcRenderer.invoke('updateUsers', formData),
      updatePassword: (formData) => ipcRenderer.invoke('updatePassword', formData)
    })

    /**
     * API classes
     */
    contextBridge.exposeInMainWorld('classe', {
      getClasse: (formData) => ipcRenderer.invoke('allLocalClasse', formData),
      createClasse: (formData) => ipcRenderer.invoke('createClasse', formData),
      deleteClasse: (formData) => ipcRenderer.invoke('deleteClasse', formData),
      updateClasse: (formData) => ipcRenderer.invoke('updateClasse', formData),
      getOneClasse: (formData) => ipcRenderer.invoke('getOneClasse', formData)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
