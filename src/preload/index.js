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
     * API année scolaire
     */
    contextBridge.exposeInMainWorld('anneeScolaire', {
      getAllAnnee: (formData) => ipcRenderer.invoke('allAnneeScolaire', formData),
      createAnneeScolaire: (formData) => ipcRenderer.invoke('createAnneeScolaire', formData),
      getListAnnee: (formData) => ipcRenderer.invoke('getAnneeScolaireList', formData),
      deleteAnnee: (formData) => ipcRenderer.invoke('deleteAnneeScolaire', formData),
      updateAnneeScolaire: (formData) => ipcRenderer.invoke('updateAnneeScolaire', formData),
      getOneAnneeScolaire: (formData) => ipcRenderer.invoke('getOneAnneeScolaire', formData)
    })

    /**
     * Api Users
     */
    contextBridge.exposeInMainWorld('users', {
      getUsers: (formData) => ipcRenderer.invoke('getLocalUsers', formData),
      getListUsers: (formData) => ipcRenderer.invoke('listUsers', formData),
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

    /**
     * API etudiant
     */
    contextBridge.exposeInMainWorld('etudiant', {
      getEtudiant: (formData) => ipcRenderer.invoke('getEtudiants', formData),
      createEtudiant: (formData) => ipcRenderer.invoke('createEleves', formData),
      getOneEtudiant: (formData) => ipcRenderer.invoke('getOneEleves', formData),
      deleteEtudiant: (formData) => ipcRenderer.invoke('deleteEtudiants', formData),
      updateEtudiant: (formData) => ipcRenderer.invoke('updateEtudiants', formData)
    })

    /**
     * API matieres
     */
    contextBridge.exposeInMainWorld('matiere', {
      getMatiere: (formData) => ipcRenderer.invoke('getMatieres', formData),
      createMatiere: (formData) => ipcRenderer.invoke('createMatiere', formData),
      updateMatiere: (formData) => ipcRenderer.invoke('updateMatiere', formData),
      getOneMatiere: (formData) => ipcRenderer.invoke('getOneMatiere', formData),
      deleteMatiere: (formData) => ipcRenderer.invoke('deleteMatiere', formData),
      asingMatiereToProf: (formData) => ipcRenderer.invoke('asingMatiereToProf', formData)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
