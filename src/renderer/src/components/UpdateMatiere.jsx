/* eslint-disable react-hooks/exhaustive-deps */
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { FaRegEdit, FaSortNumericUp } from 'react-icons/fa'
import { getOneMatieres, updateMatieres } from '../utils/Request'
import { useEffect, useState } from 'react'
import { FaBookBookmark } from 'react-icons/fa6'
import { Alert } from '../utils/Alert'

const UpdateMatiere = ({ open, handleClose, school_id, id }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    coefficient: '',
    school_id: school_id
  })

  const { data } = useQuery({
    queryKey: ['singleMatieres', id, school_id],
    queryFn: () => getOneMatieres({ id, school_id }),
    enabled: !!id
  })

  const matiere = data?.data ?? {}

  useEffect(() => {
    if (matiere && Object.keys(matiere).length !== 0) {
      setFormData((prev) => ({
        ...prev,
        id: matiere.id,
        name: matiere.name,
        coefficient: matiere.coefficient,
        school_id: matiere.school_id
      }))
    }
  }, [matiere])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateMatieres,
    onSuccess: (data) => {
      if (data && data.success == false) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
        handleClose(true)
        queryclient.invalidateQueries({ queryKey: ['Matieres'] })
        queryclient.invalidateQueries({ queryKey: ['singleMatieres'] })
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
        Modifier une Matière
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
              label="Nom"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              name="name"
              required
              placeholder="Nom de la matiere"
              value={formData.name}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaBookBookmark color="var(--secondary)" />
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
              label="Coeficient"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              type="number"
              name="coefficient"
              required
              placeholder="Coefficient de la matiere"
              value={formData.coefficient}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSortNumericUp color="var(--secondary)" />
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
          startIcon={<FaRegEdit size={15} />}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  )
}
UpdateMatiere.propTypes = {
  open: PropTypes.bool.isRequired,
  school_id: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default UpdateMatiere
