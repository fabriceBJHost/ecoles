import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { FaPlusCircle, FaSearch } from 'react-icons/fa'
import { MdViewTimeline } from 'react-icons/md'
import { listClasse } from '../utils/Request'
import { useState } from 'react'
import CreateShedule from '../components/CreateShedule'

const Schedules = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  let schoolInfo = userInfo.School.dataValues
  const schoolId = schoolInfo.id

  const { data } = useQuery({
    queryKey: ['listClass', schoolId],
    queryFn: () => listClasse({ school_id: schoolId })
  })

  const ListClass = data != undefined ? data.data : []
  // const lastClassName = localStorage.getItem('lastClass')

  const [openCreate, setOpenCrete] = useState(false)
  const handleCloseCreate = () => setOpenCrete(false)
  const handleOpenCreate = () => setOpenCrete(true)

  return (
    <Container disableGutters sx={{ overflow: 'hidden' }}>
      <CreateShedule handleClose={handleCloseCreate} open={openCreate} school_id={schoolId} />
      <Grid spacing={2} container>
        <Grid size={{ lg: 6, md: 7, sm: 7 }}>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{ color: 'var(--primary)' }}
          >
            <MdViewTimeline size={29} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Emploi du temps
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
      <Grid container spacing={2} marginTop={3} sx={{ minHeight: '78vh', overflow: 'hidden' }}>
        <Grid
          size={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}
          sx={{ borderRight: 'solid 1px var(--secondary)', paddingRight: 1 }}
        >
          <Grid size={12}>
            <TextField
              size="small"
              type="search"
              placeholder="Classe"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch color="var(--secondary)" />
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--secondary)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--secondary)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary)'
                  }
                }
              }}
            />
          </Grid>
          <Grid container spacing={2} marginTop={1} sx={{ overflowX: 'visible' }}>
            {ListClass.map((item, index) => (
              <Grid size={12} key={index}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    boxShadow: 2,
                    '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                    transition: '0.2s',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--secondary)', fontWeight: 'bold' }}
                  >
                    {item.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10 }}>
          <TableContainer component={Paper} sx={{ width: '100%' }}>
            <Table sx={{ width: '100%' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">Lundi</TableCell>
                  <TableCell align="right">Mardi</TableCell>
                  <TableCell align="right">Mercredi</TableCell>
                  <TableCell align="right">Jeudi</TableCell>
                  <TableCell align="right">Vendredi</TableCell>
                  <TableCell align="right">Samedi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Schedules
