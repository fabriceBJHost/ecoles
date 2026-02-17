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

const Matieres = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  let schoolInfo = userInfo.School.dataValues

  const schoolId = schoolInfo.id
  const [filterModel, setFilterModel] = useState({ items: [] })
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

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
      field: 'niveau',
      headerName: 'Niveau',
      headerAlign: 'center',
      align: 'left',
      minWidth: 130
    },
    {
      field: 'salle',
      headerName: 'Salle N°',
      headerAlign: 'center',
      align: 'left',
      minWidth: 150
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
          >
            <FaUserPlus size={18} />
          </IconButton>
          <IconButton title="Modifier" onClick={() => handleOpenUpdate(params.row.ids)}>
            <FaEdit size={18} />
          </IconButton>
          <IconButton
            title="Supprimer"
            onClick={() => deleteFunction(params.row.ids)}
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
    queryKey: ['Matieres', schoolId, paginationModel.page, paginationModel.pageSize, filterModel],
    queryFn: () =>
      getMatieres({
        school_id: schoolId,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        filters: filterModel.items,
        quickFilter: filterModel.quickFilterValues?.join(' ') || ''
      }),
    placeholderData: (previousData) => previousData
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataItem = data?.data ?? []
  console.log(dataItem)

  const vueUserName = (firstName, lastName) => {
    if (firstName !== null || lastName !== null) {
      return `${firstName} ${lastName}`
    } else {
      return 'Auccune Enseignant assigné a la matière'
    }
  }

  const row = useMemo(() => {
    return dataItem.map((item, index) => ({
      id: index,
      ids: item.id,
      name: item.name,
      coefficient: item.coefficient,
      teacher: vueUserName(item['Users.firstname'], item['Users.lastname'])
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

  return (
    <Container disableGutters>
      <AddMatiere handleClose={handleCloseMatiere} open={openMatiere} school_id={schoolId} />
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
                  <DataGrid
                    rows={row}
                    columns={column}
                    rowCount={data?.count ?? 0}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    showToolbar
                    pageSizeOptions={[10, 50, 100, 200]}
                    paginationMode="server"
                    filterMode="server" // TRÈS IMPORTANT : dit au Grid de ne pas filtrer localement
                    filterModel={filterModel}
                    onFilterModelChange={(newModel) => {
                      setFilterModel(newModel)
                      setPaginationModel((prev) => ({ ...prev, page: 0 })) // Reset à la page 0 quand on filtre
                    }}
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
