import { Container, Divider, Grid, Stack, Typography } from '@mui/material'
import { FaSchool } from 'react-icons/fa'

const Etablissements = () => {
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
            <FaSchool size={27} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              établissement
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: 'var(--secondary)', marginTop: '15px' }} />
    </Container>
  )
}

export default Etablissements
