import { Toolbar } from '@mui/x-data-grid'
import PropTypes from 'prop-types'

const CustomToolbar = ({ label }) => {
  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Titre à gauche */}
      <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--primary)' }}>{label}</div>
    </Toolbar>
  )
}
CustomToolbar.propTypes = {
  label: PropTypes.string.isRequired
}
export default CustomToolbar
