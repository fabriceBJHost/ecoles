import {
  Avatar,
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
import { DataGrid } from '@mui/x-data-grid'
import {
  FaEdit,
  FaEye,
  FaPlusCircle,
  FaRegFileExcel,
  FaRegUserCircle,
  FaTrashAlt,
  FaUser
} from 'react-icons/fa'
import { frFR } from '@mui/x-data-grid/locales'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { appTheme } from '../utils/theme'
import { Alert, Confirm } from '../utils/Alert'
import { deleteUsers } from '../utils/Request'
import { formatPhoneNumber } from '../utils/Function'

const Users = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  let schoolInfo = userInfo.School.dataValues

  const schoolId = schoolInfo.id
  const column = [
    {
      field: 'photos',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      width: 50,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={params.row.username}
          sx={{ width: 35, height: 35, border: '2px solid #e0e0e0' }}
        >
          <FaUser size={16} />
        </Avatar>
      )
    },
    {
      field: 'username',
      headerName: "Nom d'utilisateur",
      headerAlign: 'center',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'firstname',
      headerName: 'Nom',
      headerAlign: 'center',
      align: 'left',
      width: 120
    },
    {
      field: 'lastname',
      headerName: 'Prénom',
      headerAlign: 'center',
      align: 'left',
      width: 100
    },
    {
      field: 'numbers1',
      headerName: 'Téléphone',
      headerAlign: 'center',
      align: 'left',
      width: 150
    },
    {
      field: 'address',
      headerName: 'Adresse',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'Role.nom',
      headerName: 'Rôles',
      headerAlign: 'center',
      align: 'right',
      width: 130
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
          <IconButton title="Voir plus de détail">
            <FaEye size={18} />
          </IconButton>
          <IconButton title="Modifier">
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

  const [filterModel, setFilterModel] = useState({ items: [] })
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const { data, isLoading, isPlaceholderData, isError, error } = useQuery({
    // La queryKey inclut la page et le pageSize pour déclencher un fetch à chaque changement
    queryKey: ['users', schoolId, paginationModel.page, paginationModel.pageSize, filterModel],
    queryFn: async () => {
      const response = await window.users.getUsers({
        school_id: schoolId,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        filters: filterModel.items,
        quickFilter: filterModel.quickFilterValues?.join(' ') || ''
      })
      return response // Doit contenir { rows: [...], total: 100 }
    },
    placeholderData: (previousData) => previousData
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataItem = data?.data ?? []

  const row = useMemo(() => {
    return dataItem.map((item) => ({
      id: item.id,
      'Role.nom': item['Role.nom'],
      username: item.username,
      firstname: item.firstname,
      lastname: item.lastname,
      numbers1: formatPhoneNumber(item.numbers1),
      address: item.address,
      photos: item.photo
    }))
  }, [dataItem])

  const queryclient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: (data) => {
      if (!data.success) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        queryclient.invalidateQueries({ queryKey: ['users'] })
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
      }
    }
  })
  const deleteFunction = async (id) => {
    const confirm = await Confirm(
      'êtes vous Sure ?',
      'Voulez vous supprimé cette utilisateur ?',
      'warning',
      'Oui',
      'var(--primary)',
      'Non'
    )

    if (confirm) {
      deleteMutation.mutate({ id: id, school_id: schoolId })
    }
  }
  return (
    <Container disableGutters>
      <Grid spacing={2} container>
        <Grid size={{ lg: 6, md: 7, sm: 7 }}>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{ color: 'var(--primary)' }}
          >
            <FaRegUserCircle size={27} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Utilisateur
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ lg: 6, md: 5, sm: 5 }} textAlign={'right'}>
          <Button
            size="small"
            variant="contained"
            startIcon={<FaPlusCircle size={16} />}
            sx={{ textTransform: 'capitalize', background: 'var(--primary)', marginRight: '30px' }}
          >
            Nouveau
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FaRegFileExcel size={16} />}
            sx={{
              textTransform: 'capitalize',
              borderColor: 'var(--primary)!important',
              color: 'var(--primary)!important'
            }}
          >
            Importer
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

export default Users
