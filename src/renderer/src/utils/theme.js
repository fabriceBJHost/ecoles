import { createTheme } from '@mui/material/styles'
export const appTheme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.8rem',
          border: '1px solid #7180967e',
          width: '100%',
          // Suppression du scroll horizontal inutile
          '& .MuiDataGrid-virtualScroller': {
            overflowX: 'hidden !important'
          },
          // Couleur des lignes séparatrices des cellules
          '& .MuiDataGrid-cell': {
            borderColor: '#7180967e'
          },
          // Style des en-têtes de colonnes
          '& .MuiDataGrid-columnHeaders': {
            fontSize: '0.85rem',
            borderBottom: '0px solid #7180967e !important'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold'
          },
          // Icônes et séparateurs de colonnes
          '& .MuiIconButton-root': {
            color: 'var(--secondary)'
          },
          '& .MuiDataGrid-columnSeparator': {
            color: 'var(--secondary)'
          },
          // Style des boutons dans la toolbar et pagination
          '& .MuiButton-root': {
            color: 'var(--secondary)',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem'
          }
        }
      }
    },
    MuiGridFilterPanel: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", sans-serif',
          // Style des inputs dans le panneau de filtre
          '& .MuiInputBase-root': {
            fontSize: '0.8rem',
            '&:after': {
              borderBottomColor: 'var(--secondary)' // Ligne sous l'input quand focus
            }
          },
          // Style des labels (les noms des champs)
          '& .MuiFormLabel-root.Mui-focused': {
            color: 'var(--secondary)'
          }
        }
      }
    }
  }
})
