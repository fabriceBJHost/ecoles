import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  ThemeProvider
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { frFR } from '@mui/x-data-grid/locales'
import { useMemo, useState } from 'react'
import { appTheme } from '../utils/theme'
import { FaEdit, FaPlusCircle, FaTrashAlt } from 'react-icons/fa'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteAnneeScolaire, getAllAnneeScolaire } from '../utils/Request'
import AddAnneeScolaire from '../components/AddAnneeScolaire'
import { parseDate } from '../utils/Function'
import { Confirm, Alert } from '../utils/Alert'
import UpdateAnneeScolaire from '../components/UpdateAnneeScolaire'

// eslint-disable-next-line react/prop-types
const AnneeScolaires = ({ school_id }) => {
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
      field: 'start_date',
      headerName: 'Date de début',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'end_date',
      headerName: 'Date de fin',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'is_active',
      headerName: 'Active',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      sortable: false
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
    queryKey: [
      'anneeScolaire',
      school_id,
      paginationModel.page,
      paginationModel.pageSize,
      filterModel
    ],
    queryFn: () =>
      getAllAnneeScolaire({
        school_id: school_id,
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
      start_date: parseDate(item.start_date),
      end_date: parseDate(item.end_date),
      is_active: item.is_active
    }))
  }, [dataItem])

  const [openCreate, setOpenCreate] = useState(false)
  const handleOpenCreate = () => setOpenCreate(true)
  const handleCloseCreate = () => setOpenCreate(false)

  const queryclient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteAnneeScolaire,
    onSuccess: (data) => {
      if (data && !data.success) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        queryclient.invalidateQueries({ queryKey: ['anneeScolaire'] })
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
      "Voulez vous supprimer l'année scolaire ?",
      'warning',
      'Oui',
      'var(--primary)',
      'Non'
    )

    if (confirm) {
      deleteMutation.mutate({ id: id, school_id: school_id })
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
    <Box>
      <AddAnneeScolaire open={openCreate} school_id={school_id} handleClose={handleCloseCreate} />
      <UpdateAnneeScolaire
        open={openUpdate}
        school_id={school_id}
        handleClose={handleCloseUpdate}
        id={idToUpdate}
      />
      <Grid spacing={2} container>
        <Grid size={12} textAlign={'right'}>
          <Button
            size="small"
            variant="contained"
            startIcon={<FaPlusCircle size={16} />}
            sx={{
              textTransform: 'capitalize',
              background: 'var(--primary)',
              marginRight: '30px',
              mb: 1
            }}
            onClick={handleOpenCreate}
          >
            Nouveau
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
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
    </Box>
  )
}

export default AnneeScolaires
