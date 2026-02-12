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
import { useEffect, useState } from 'react'
import { FaCalendar, FaCalendarAlt, FaEdit } from 'react-icons/fa'
import { Alert } from '../utils/Alert'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getOneAnneeScolaire, updateAnneeScolaire } from '../utils/Request'
import dayjs from 'dayjs'

const UpdateAnneeScolaire = ({ open, handleClose, school_id, id }) => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    school_id: school_id,
    start_date: '',
    end_date: '',
    is_active: ''
  })

  const { data } = useQuery({
    queryKey: ['singleClasse', id, school_id],
    queryFn: () => getOneAnneeScolaire({ id, school_id }),
    enabled: !!id
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const annee = data?.data ?? {}

  useEffect(() => {
    if (annee && Object.keys(annee).length !== 0) {
      setFormData((prev) => ({
        ...prev,
        id: annee.id,
        name: annee.name,
        start_date: dayjs(annee.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(annee.end_date).format('YYYY-MM-DD'),
        is_active: annee.is_active,
        school_id: annee.school_id
      }))
    }
  }, [annee])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateAnneeScolaire,
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
        Modifier une année scolaire
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
          startIcon={<FaEdit size={15} />}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  )
}
UpdateAnneeScolaire.propTypes = {
  open: PropTypes.bool.isRequired,
  school_id: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default UpdateAnneeScolaire
