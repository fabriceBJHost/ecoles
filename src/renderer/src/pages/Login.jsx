import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material'
import { useState } from 'react'
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'
import { RiLoginCircleFill } from 'react-icons/ri'
import { Alert } from '../utils/Alert'
import { useAuthContext } from '../contexts/AuthContext'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const { setUser, setToken } = useAuthContext()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const formSubmit = async (e) => {
    e.preventDefault()
    const response = await window.auth.login(formData)

    if (!response.success) {
      Alert('Erreur', response.message, 'error', 'OK', 'var(--primary)')
    } else {
      Alert('Connecté', 'Connection réussi', 'success', 'OK', 'var(--primary)')
      setUser(JSON.stringify(response.user))
      setToken(JSON.stringify(response.user))
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // Aligne la boîte à droite
        pr: { md: 10, xs: 2 }, // Espacement à droite
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' // Fond léger
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        component={'form'}
        onSubmit={formSubmit}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="var(--primary)">
            Connexion
          </Typography>
          <Typography variant="body2" color="var(--secondary)">
            Heureux de vous revoir !
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Nom d'utilisateur"
          variant="outlined"
          size="small"
          color="black"
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
          placeholder="votre nom d'utilisateur"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FaUser color="var(--secondary)" size={16} />
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

        <TextField
          fullWidth
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          color="black"
          required
          placeholder="Mot de passe"
          size="small"
          name="password"
          value={formData.password}
          onChange={handleChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock color="var(--secondary)" size={16} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <FaEyeSlash color="var(--secondary)" size={16} />
                    ) : (
                      <FaEye color="var(--secondary)" size={16} />
                    )}
                  </IconButton>
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            href="#"
            variant="body2"
            underline="hover"
            sx={{ fontWeight: 500, color: 'var(--secondary)' }}
          >
            Mot de passe oublié ?
          </Link>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="small"
          type="submit"
          startIcon={<RiLoginCircleFill />}
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            borderRadius: 2,
            background: 'var(--primary)'
          }}
        >
          Se connecter
        </Button>
      </Paper>
    </Box>
  )
}

export default Login
