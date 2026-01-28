import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { FaEdit, FaPlusCircle, FaTrashAlt, FaUsps } from 'react-icons/fa'
import { allLocalClasse, deleteClasse } from '../utils/Request'
import { appTheme } from '../utils/theme'
import { ThemeProvider } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import { frFR } from '@mui/x-data-grid/locales'
import AddClasse from '../components/AddClasse'
import { Alert, Confirm } from '../utils/Alert'
import UpdateClasse from '../components/UpdateClasse'

const Classes = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  let schoolInfo = userInfo.school
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
      align: 'center',
      flex: 1
    },
    {
      field: 'level',
      headerName: 'Niveau',
      headerAlign: 'center',
      align: 'center',
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
        <Stack direction={'row'} spacing={1} id={params.row.id} alignItems={'center'}>
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
    queryKey: ['classes', schoolId, paginationModel.page, paginationModel.pageSize, filterModel],
    queryFn: () =>
      allLocalClasse({
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

  const row = useMemo(() => {
    return dataItem.map((item) => ({
      id: item.id,
      name: item.name,
      level: item.level
    }))
  }, [dataItem])

  const [openCreate, setOpenCreate] = useState(false)
  const handleCloseCreate = () => setOpenCreate(false)
  const handleOpenCreate = () => setOpenCreate(true)

  const queryclient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: deleteClasse,
    onSuccess: (data) => {
      if (data && !data.success) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        queryclient.invalidateQueries({ queryKey: ['classes'] })
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
      'Voulez vous supprimer ce classe ?',
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
  const [idToUpdate, setIdToUpdate] = useState(null)
  const handleOpenUpdate = (id) => {
    setIdToUpdate(id)
    setOpenUpdate(true)
  }

  return (
    <Container disableGutters>
      <AddClasse handleClose={handleCloseCreate} open={openCreate} school_id={schoolId} />
      <UpdateClasse
        handleClose={handleCloseUpdate}
        id={idToUpdate}
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
            <FaUsps size={29} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Classes / Niveau
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ lg: 6, md: 5, sm: 5 }} textAlign={'right'}>
          <Button
            size="small"
            variant="contained"
            startIcon={<FaPlusCircle size={16} />}
            sx={{ textTransform: 'capitalize', background: 'var(--primary)', marginRight: '30px' }}
            onClick={handleOpenCreate}
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
                    columnVisibilityModel={'stripped'}
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

export default Classes
