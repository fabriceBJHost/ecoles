import { Box, Typography, Button, Container } from '@mui/material'
import { FaExclamationTriangle, FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
    >
      <Box
        sx={{
          // marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '100vh',
          justifyContent: 'center'
        }}
      >
        {/* Icône d'alerte avec ta couleur --warning */}
        <FaExclamationTriangle
          size={80}
          style={{ color: 'var(--warning)', marginBottom: '20px' }}
        />

        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            color: 'var(--primary)', // Ton bleu foncé
            fontSize: { xs: '4rem', md: '6rem' }
          }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ color: 'var(--secondary)', mb: 2 }}>
          Oups ! La page que vous recherchez est introuvable.
        </Typography>

        <Typography variant="body1" sx={{ color: 'var(--secondary)', mb: 4, maxWidth: '500px' }}>
          Il semble que le lien soit rompu ou que la page ait été déplacée. Ne vous inquiétez pas,
          vous pouvez retourner à l&apos;accueil.
        </Typography>

        {/* Bouton avec ta couleur --primary */}
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          // size="small"
          startIcon={<FaHome />}
          sx={{
            backgroundColor: 'var(--primary)',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: 'var(--secondary)' // Changement au survol
            }
          }}
        >
          Retour à l&apos;accueil
        </Button>
      </Box>
    </Container>
  )
}

export default NotFound
