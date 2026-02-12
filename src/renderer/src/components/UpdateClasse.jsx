/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
  Autocomplete,
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
import { memo, useEffect, useMemo, useState } from 'react'
import { FaCalendar, FaCaretUp, FaRegEdit, FaTeeth } from 'react-icons/fa'
import { getAnneeScolaireList, getClasseByPk, updateClasse } from '../utils/Request'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert } from '../utils/Alert'

const UpdateClasse = ({ open, handleClose, school_id, id }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    level: '',
    school_id: school_id,
    academic_year_id: '',
    capacity: '',
    classroom: ''
  })

  const { data } = useQuery({
    queryKey: ['singleClasse', id],
    queryFn: () => getClasseByPk({ id }),
    enabled: !!id
  })

  const { data: Scolaire = [] } = useQuery({
    queryKey: ['listAnneeScolaire'],
    queryFn: () => getAnneeScolaireList({ school_id })
  })

  const anneeItems = Scolaire.data ?? []

  const selectedAcademicYears = useMemo(
    () => anneeItems.find((item) => item.id === formData.academic_year_id) || null,
    [anneeItems, formData.academic_year_id]
  )

  const filteredMembers = useMemo(() => {
    return (options, params) => {
      const input = params.inputValue.toLowerCase()
      return options.filter((option) => {
        return option.name?.toLowerCase().includes(input)
      })
    }
  }, [])

  const RenderMemberOption = memo(({ props, option }) => (
    <li {...props} key={option.id}>
      {option.name}
    </li>
  ))

  const classe = data?.data ?? {}

  useEffect(() => {
    if (classe && Object.keys(classe).length !== 0) {
      setFormData((prev) => ({
        ...prev,
        id: classe.id,
        name: classe.name,
        level: classe.level,
        school_id: classe.school_id,
        academic_year_id: classe.academic_year_id,
        capacity: classe.capacity,
        classroom: classe.classroom
      }))
    }
  }, [classe])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateClasse,
    onSuccess: (data) => {
      if (data && data.success == false) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
        handleClose(true)
        queryclient.invalidateQueries({ queryKey: ['classes'] })
        queryclient.invalidateQueries({ queryKey: ['singleClasse'] })
        setFormData((prev) => ({
          ...prev,
          id: '',
          name: '',
          level: '',
          school_id: school_id
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
        Modifier une Classe
      </DialogTitle>
      <DialogContent
        dividers={true}
        sx={{
          p: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="Classe"
              size="small"
              fullWidth
              margin="dense"
              name="name"
              required
              placeholder="Nom du classe: 4e"
              value={formData.name}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaTeeth />
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
              label="Niveau"
              size="small"
              fullWidth
              margin="dense"
              name="level"
              required
              placeholder="Niveau: 4e A, 4e B, ..."
              value={formData.level}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaTeeth />
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
              label="Capaciter"
              size="small"
              fullWidth
              margin="dense"
              name="capacity"
              type="number"
              required
              placeholder="Capaciter de la salle"
              value={formData.capacity}
              onChange={handleChange}
              color="black"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaCaretUp color="var(--secondary)" />
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
              label="Salle N°"
              size="small"
              fullWidth
              margin="dense"
              name="classroom"
              type="number"
              required
              placeholder="Numéro de la salle"
              value={formData.classroom}
              onChange={handleChange}
              color="black"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaCaretUp color="var(--secondary)" />
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
          <Grid size={12}>
            <Autocomplete
              options={anneeItems}
              value={selectedAcademicYears}
              getOptionLabel={(option) => option.name || ''}
              filterOptions={filteredMembers}
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  academic_year_id: newValue ? newValue.id : ''
                }))
              }}
              renderOption={(props, option) => <RenderMemberOption props={props} option={option} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  color="black"
                  label="Sélectionner une année scolaire"
                  placeholder="Choisir une année scolaire"
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
                  margin="dense"
                  required
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaCalendar color="var(--secondary)" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
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
          startIcon={<FaRegEdit size={15} />}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  )
}
UpdateClasse.propTypes = {
  open: PropTypes.bool.isRequired,
  school_id: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default UpdateClasse
