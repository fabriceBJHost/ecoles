import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField
} from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { FaCalendar, FaCalendarAlt, FaPlusCircle } from 'react-icons/fa'
import { Alert } from '../utils/Alert'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnneeScolaire } from '../utils/Request'

const AddAnneeScolaire = ({ open, handleClose, school_id }) => {
  const [formData, setFormData] = useState({
    name: '',
    school_id: school_id,
    start_date: '',
    end_date: '',
    is_active: 0
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createAnneeScolaire,
    onSuccess: (data) => {
      if (data && data.success == false) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
        handleClose(true)
        queryclient.invalidateQueries({ queryKey: ['anneeScolaire'] })
        queryclient.invalidateQueries({ queryKey: ['listAnneeScolaire'] })
        setFormData((prev) => ({
          ...prev,
          name: '',
          school_id: school_id,
          start_date: '',
          end_date: '',
          is_active: 0
        }))
      }
    },
    onError: (error) => {
      Alert('Erreur', error.message, 'error', 'OK', 'var(--primary)')
    }
  })

  const formSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }
  return (
    <Dialog
      open={open}
      component={'form'}
      onSubmit={formSubmit}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: 'var(--primary)',
          fontWeight: 'bold'
        }}
      >
        Ajouter une nouvelle année scolaire
      </DialogTitle>
      <DialogContent
        dividers={true}
        sx={{
          p: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              label="Nom"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              name="name"
              required
              placeholder="2021-2022"
              value={formData.name}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaCalendar color="var(--secondary)" />
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
          <Grid size={6}>
            <TextField
              label="Date de début"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              name="start_date"
              required
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaCalendarAlt color="var(--secondary)" />
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
          <Grid size={6}>
            <TextField
              label="Date de fin"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              name="end_date"
              required
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaCalendarAlt color="var(--secondary)" />
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          type="submit"
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            borderRadius: 2,
            color: 'var(--primary)'
          }}
          size="small"
          startIcon={<FaPlusCircle size={15} />}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  )
}
AddAnneeScolaire.propTypes = {
  open: PropTypes.bool.isRequired,
  school_id: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default AddAnneeScolaire
