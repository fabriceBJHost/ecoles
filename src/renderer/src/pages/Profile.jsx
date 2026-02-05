import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import { useAuthContext } from '../contexts/AuthContext'
import { FaKey, FaUser, FaUserEdit } from 'react-icons/fa'
import dayjs from 'dayjs'

const Profile = () => {
  const { user } = useAuthContext()
  const userInfo = JSON.parse(user)

  return (
    <Container
      disableGutters
      maxWidth="xl"
      sx={{
        background: 'none!important'
      }}
    >
      <Grid spacing={2} container>
        <Grid size={{ lg: 6, md: 7, sm: 7 }}>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{ color: 'var(--primary)' }}
          >
            <FaUser size={27} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              Profile utilisateur
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: 'var(--secondary)', marginTop: '15px' }} />
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }} elevation={10}>
        <CardHeader
          avatar={
            <Avatar
              src={userInfo.photo || ''}
              alt={userInfo.username}
              sx={{ width: 80, height: 80 }}
            >
              <FaUser />
            </Avatar>
          }
          title={
            <Typography variant="h5" fontWeight="600">
              {userInfo.full_name}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              @{userInfo.username} •{' '}
              {userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)}
            </Typography>
          }
        />
        <CardContent>
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                background: 'var(--primary)'
              }}
              size="small"
              startIcon={<FaUserEdit />}
            // onClick={() => handleOpenUpdateInfo(userInfo.user_id)}
            >
              Éditer Profil
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: 'var(--secondary)',
                color: 'var(--secondary)'
              }}
              startIcon={<FaKey />}
            // onClick={() => handleOpenPassword(userInfo.user_id)}
            >
              Changer Mot de Passe
            </Button>
          </Stack>

          <Box mt={3}>
            <Typography variant="subtitle1" sx={{ color: 'var(--primary)' }} fontWeight="600">
              Informations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Créé le: {dayjs(userInfo.created_at).format('DD-MM-YYYY')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Modifier le: {dayjs(userInfo.updated_at).format('DD-MM-YYYY')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Profile
