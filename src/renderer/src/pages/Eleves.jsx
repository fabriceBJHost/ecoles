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
  ThemeProvider,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { frFR } from '@mui/x-data-grid/locales'
import { useMemo, useState } from 'react'
import {
  FaEdit,
  FaPlusCircle,
  FaRegFileExcel,
  FaTrashAlt,
  FaUser,
  FaUserGraduate
} from 'react-icons/fa'
import { appTheme } from '../utils/theme'
import { getEleves } from '../utils/Request'
import { useQuery } from '@tanstack/react-query'
import { parseDate } from '../utils/Function'

const Eleves = () => {
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
      width: 120
    },
    {
      field: 'birthdate',
      headerName: 'Naissance',
      headerAlign: 'center',
      align: 'center',
      width: 120,
      sortable: false
    },
    {
      field: 'academic_year_id',
      headerName: 'Année scolaire',
      headerAlign: 'center',
      align: 'center',
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'left',
      sortable: false,
      width: 120
    },
    {
      field: 'address',
      headerName: 'Adrèsse',
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
          <IconButton title="Modifier">
            <FaEdit size={18} />
          </IconButton>
          <IconButton
            title="Supprimer"
            // onClick={() => deleteFunction(params.row.id)}
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
    queryKey: ['eleves', schoolId, paginationModel.page, paginationModel.pageSize, filterModel],
    queryFn: () =>
      getEleves({
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
      firstname: item.firstname,
      lastname: item.lastname,
      address: item.address,
      photos: item.photos,
      academic_year_id: item['Annee_Scolaire.name'],
      birthdate: parseDate(item.birthdate),
      status: item.status
    }))
  }, [dataItem])
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
            <FaUserGraduate size={27} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Elèves
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
      <Grid container spacing={2} mt={3}>
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

export default Eleves
