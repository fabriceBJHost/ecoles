/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  IconButton,
  Avatar,
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Stack,
  Paper
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  FaTimes as CloseIcon,
  FaPhoneAlt as PhoneIcon,
  FaIdBadge as BadgeIcon,
  FaUser as AccountCircleIcon
} from 'react-icons/fa'
import { FaLocationDot as LocationOnIcon } from 'react-icons/fa6'
import { getOneUser } from '../utils/Request'
import { formatPhoneNumber } from '../utils/Function'

const UserDetailsModal = ({ open, handleClose, id, school_id }) => {
  const { data: userInfo = {} } = useQuery({
    queryKey: ['UserSingles', id],
    queryFn: () => getOneUser({ id, school_id }),
    enabled: !!id
  })

  const data = userInfo.data || {}

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, padding: 1 }
      }}
    >
      {/* Bouton Fermer */}
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', right: 12, top: 12, color: 'grey.500' }}
      >
        <CloseIcon color="var(--primary)" />
      </IconButton>

      <DialogContent>
        {/* EN-TÊTE : Photo et Identité */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 2 }}>
          <Avatar
            src={data.photo}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: '4px solid',
              borderColor: 'var(--secondary)',
              boxShadow: 3
            }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'var(--primary)' }}>
            {data.firstname} {data.lastname}
          </Typography>
          <Chip
            label={data.Role?.dataValues.nom || ''}
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 'bold',
              px: 2,
              color: 'var(--secondary)',
              borderColor: 'var(--secondary)'
            }}
          />
        </Box>

        <Divider sx={{ mb: 3, borderColor: 'var(--secondary)' }} />

        {/* CONTENU : Détails */}
        <Grid container spacing={2}>
          {/* Section Identifiants */}
          <Grid size={6}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Compte & Authentification
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, mt: 1, bgcolor: 'grey.50', borderColor: 'var(--primary)' }}
            >
              <Stack spacing={1.5}>
                <DetailItem
                  icon={<AccountCircleIcon color="var(--secondary)" />}
                  label="Nom d'utilisateur"
                  value={data.username}
                />
                <DetailItem
                  icon={<BadgeIcon color="var(--secondary)" />}
                  label="ID Employé"
                  value={`#${data.id}`}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Section Contact */}
          <Grid size={6}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Contact & Localisation
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, mt: 1, bgcolor: 'grey.50', borderColor: 'var(--primary)' }}
            >
              <Stack spacing={1.5}>
                <DetailItem
                  icon={<PhoneIcon color="var(--secondary)" />}
                  label="Téléphone principal"
                  value={formatPhoneNumber(data.numbers1)}
                />
                {data.numbers2 && (
                  <DetailItem
                    icon={<PhoneIcon color="var(--secondary)" />}
                    label="Téléphone secondaire"
                    value={formatPhoneNumber(data.numbers2)}
                  />
                )}
                <DetailItem
                  icon={<LocationOnIcon color="var(--secondary)" />}
                  label="Adresse"
                  value={data.address}
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

// Petit composant utilitaire pour les lignes de détails
const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    {icon}
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="500">
        {value}
      </Typography>
    </Box>
  </Box>
)

export default UserDetailsModal
