import { Button, Container, Divider, Grid, Stack, Typography } from '@mui/material'
import { FaPlusCircle, FaRegFileExcel, FaUserGraduate } from 'react-icons/fa'

const Eleves = () => {
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
    </Container>
  )
}

export default Eleves
