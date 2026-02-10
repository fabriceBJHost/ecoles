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
import {
  FaTimes as CloseIcon,
  FaPhoneAlt as PhoneIcon,
  FaIdBadge as BadgeIcon,
  FaUser as AccountCircleIcon
} from 'react-icons/fa'
import { FaLocationDot as LocationOnIcon } from 'react-icons/fa6'

// Simulation d'une donnée statique basée sur ton modèle
const staticUser = {
  firstname: 'Jean',
  lastname: 'Dupont',
  username: 'j.dupont2024',
  role_name: 'DIRECTEUR', // Vient de la jointure Role
  photo: 'https://i.pravatar.cc/300',
  numbers1: '+261 34 00 000 00',
  numbers2: '032 11 222 33',
  address: "123 Rue de l'École, Antananarivo, Madagascar",
  created_at: '2024-02-10T10:00:00Z'
}

const UserDetailsModal = ({ open, handleClose }) => {
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
            src={staticUser.photo}
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
            {staticUser.firstname} {staticUser.lastname}
          </Typography>
          <Chip
            label={staticUser.role_name}
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
                  value={staticUser.username}
                />
                <DetailItem
                  icon={<BadgeIcon color="var(--secondary)" />}
                  label="ID Employé"
                  value="#12345"
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
                  value={staticUser.numbers1}
                />
                {staticUser.numbers2 && (
                  <DetailItem
                    icon={<PhoneIcon color="var(--secondary)" />}
                    label="Téléphone secondaire"
                    value={staticUser.numbers2}
                  />
                )}
                <DetailItem
                  icon={<LocationOnIcon color="var(--secondary)" />}
                  label="Adresse"
                  value={staticUser.address}
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
