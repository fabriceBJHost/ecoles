import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  ThemeProvider,
  Typography
} from '@mui/material'
import { FaBook, FaEdit, FaPlusCircle, FaTrashAlt, FaUserPlus } from 'react-icons/fa'
import { appTheme } from '../utils/theme'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteMatieres, getMatieres } from '../utils/Request'
import { useMemo, useState } from 'react'
import { frFR } from '@mui/x-data-grid/locales'
import { DataGrid } from '@mui/x-data-grid'
import AddMatiere from '../components/AddMatiere'
import { Alert, Confirm } from '../utils/Alert'
import UpdateMatiere from '../components/UpdateMatiere'
import AsignMatiereToProff from '../components/AsignMatiereToProff'

const Matieres = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  let schoolInfo = userInfo.School.dataValues

  const schoolId = schoolInfo.id
  const paginationModel = { page: 0, pageSize: 10 }

  const column = [
    {
      field: 'name',
      headerName: 'Nom',
      headerAlign: 'center',
      align: 'right',
      minWidth: 180
    },
    {
      field: 'coefficient',
      headerName: 'Coeficient',
      headerAlign: 'center',
      align: 'center',
      width: 120
    },
    {
      field: 'teacher',
      headerName: 'Enseignants',
      headerAlign: 'center',
      align: 'left',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack
          direction={'row'}
          spacing={1}
          id={params.row.id}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <IconButton
            title="Assigné a un ou plusieur enseignant"
            sx={{ color: 'var(--primary)!important' }}
            onClick={() => handleOpenAssing(params.row.id, params.row.name)}
          >
            <FaUserPlus size={18} />
          </IconButton>
          <IconButton title="Modifier" onClick={() => handleOpenUpdate(params.row.id)}>
            <FaEdit size={18} />
          </IconButton>
          <IconButton
            title="Supprimer"
            onClick={() => deleteFunction(params.row.id)}
            sx={{ color: 'var(--error)!important' }}
          >
            <FaTrashAlt size={18} />
          </IconButton>
        </Stack>
      )
    }
  ]

  const { data, isLoading, isPlaceholderData, isError, error } = useQuery({
    // La queryKey inclut la page et le pageSize pour déclencher un fetch à chaque changement
    queryKey: ['Matieres', schoolId],
    queryFn: () => getMatieres({ school_id: schoolId }),
    placeholderData: (previousData) => previousData
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataItem = data?.data ?? []

  const row = useMemo(() => {
    // 1. On crée un dictionnaire pour regrouper par ID
    const grouped = dataItem.reduce((acc, item) => {
      const id = item.id
      const currentTeacher = item['Users.firstname']
        ? `${item['Users.firstname']} ${item['Users.lastname']}`
        : null

      if (!acc[id]) {
        // Si la matière n'existe pas encore, on la crée
        acc[id] = {
          id: item.id,
          name: item.name,
          coefficient: item.coefficient,
          teachers: currentTeacher ? [currentTeacher] : [] // On stocke dans un tableau
        }
      } else {
        // Si elle existe et que le prof n'est pas déjà dans la liste
        if (currentTeacher && !acc[id].teachers.includes(currentTeacher)) {
          acc[id].teachers.push(currentTeacher)
        }
      }
      return acc
    }, {})

    // 2. On transforme l'objet en tableau final pour le DataGrid
    return Object.values(grouped).map((matiere) => ({
      id: matiere.id,
      name: matiere.name,
      coefficient: matiere.coefficient,
      teacher:
        matiere.teachers.length > 0
          ? matiere.teachers.join(', ') // "Nom1, Nom2, Nom3"
          : 'Aucun Enseignant assigné'
    }))
  }, [dataItem])

  const [openMatiere, setOpenMatiere] = useState(false)
  const handleOpenMatiere = () => setOpenMatiere(true)
  const handleCloseMatiere = () => setOpenMatiere(false)

  const queryclient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: deleteMatieres,
    onSuccess: (data) => {
      if (data && !data.success) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        queryclient.invalidateQueries({ queryKey: ['Matieres'] })
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
      }
    },
    onError: (err) => {
      Alert('Erreur', err.message, 'error', 'OK', 'var(--primary)')
    }
  })

  const deleteFunction = async (id) => {
    const confirm = await Confirm(
      'êtes vous sûre ?',
      'Voulez vous supprimer ce matière ?',
      'warning',
      'Oui',
      'var(--primary)',
      'Non'
    )

    if (confirm) {
      deleteMutation.mutate({ id: id, school_id: schoolId })
    }
  }

  const [openUpdate, setOpenUpdate] = useState(false)
  const handleCloseUpdate = () => setOpenUpdate(false)
  const [idUpdate, setIdUpdate] = useState(null)
  const handleOpenUpdate = (id) => {
    setIdUpdate(id)
    setOpenUpdate(true)
  }

  const [matiere_id, setMatiereId] = useState(null)
  const [nomMatieres, setNomMatieres] = useState(null)
  const [openAssing, setOpenAssing] = useState(false)
  const handleCloseAssing = () => setOpenAssing(false)
  const handleOpenAssing = (id, nomMatieres) => {
    setMatiereId(id)
    setNomMatieres(nomMatieres)
    setOpenAssing(true)
  }

  return (
    <Container disableGutters>
      <AddMatiere handleClose={handleCloseMatiere} open={openMatiere} school_id={schoolId} />
      <AsignMatiereToProff
        school_id={schoolId}
        id={matiere_id}
        open={openAssing}
        handleClose={handleCloseAssing}
        nomMatieres={nomMatieres}
      />
      <UpdateMatiere
        handleClose={handleCloseUpdate}
        id={idUpdate}
        open={openUpdate}
        school_id={schoolId}
      />
      <Grid spacing={2} container>
        <Grid size={{ lg: 6, md: 7, sm: 7 }}>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{ color: 'var(--primary)' }}
          >
            <FaBook size={29} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Matieres
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ lg: 6, md: 5, sm: 5 }} textAlign={'right'}>
          <Button
            size="small"
            variant="contained"
            startIcon={<FaPlusCircle size={16} />}
            sx={{ textTransform: 'capitalize', background: 'var(--primary)', marginRight: '30px' }}
            onClick={handleOpenMatiere}
          >
            Nouveau
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: 'var(--secondary)', marginTop: '15px' }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} marginTop={3}>
          <Card style={{ height: '100%' }}>
            <CardContent>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column', // Stacks content vertically on smaller screens,
                  width: '100%'
                }}
              >
                <ThemeProvider theme={appTheme}>
                  {/* comme la matiere n'est pas une ligne tres nombreux, on le filttre en local non pas coté serveur */}
                  <DataGrid
                    rows={row}
                    columns={column}
                    initialState={{ pagination: { paginationModel } }}
                    showToolbar
                    rowBuffer={2} // 👈 réduit le nombre de lignes gardées en mémoire
                    rowThreshold={5} // 👈 limite le préchargement
                    pageSizeOptions={[10, 50, 100, 200]}
                    disableRowSelectionOnClick
                    loading={isLoading}
                    error={isError ? error : null}
                    density="compact"
                    // Optionnel : Désactive l'interactivité pendant que React Query récupère la suite
                    disabled={isPlaceholderData}
                    localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                  />
                </ThemeProvider>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Matieres
