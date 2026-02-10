import { styled, useTheme, alpha } from '@mui/material/styles'
import {
  Box,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Badge
} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import MuiDrawer from '@mui/material/Drawer'
import {
  FaChevronRight as ChevronRightIcon,
  FaChevronLeft as ChevronLeftIcon,
  FaBars as MenuIcon,
  FaSearch,
  FaChevronDown,
  FaBell,
  FaUser,
  FaTachometerAlt,
  FaUserFriends,
  FaUsps,
  FaSchool,
  FaUserGraduate
} from 'react-icons/fa'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import classe from '../assets/Navigation.module.css'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { useAuthContext } from '../contexts/AuthContext'

const drawerWidth = 200

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden!important'
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      }
    }
  ]
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
      }
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
      }
    }
  ]
}))

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.3)
  },
  marginLeft: 0,
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(1),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // padding left = search icon width + spacing
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '25ch',
    [theme.breakpoints.up('lg')]: {
      width: '30ch'
    }
  }
}))

const Navigation = ({ children, setSearchItem }) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = localStorage.getItem('user')
  const userInfo = JSON.parse(user)
  const { setUser, setToken } = useAuthContext()

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          background: 'var(--primary)',
          boxShadow: 'none'
        }}
      >
        <Toolbar
          sx={{
            minHeight: '40px!important'
          }}
        >
          {/* LEFT : Menu + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[{ marginRight: 1 }, open && { display: 'none' }]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Ecole Management
            </Typography>
          </Box>

          {/* MIDDLE : Search bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <FaSearch />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Rechercher…"
                type="search"
                onInput={(e) => {
                  const value = e.target.value
                  setSearchItem(value)
                  if (value.trim() === '') {
                    navigate('/dashboard')
                  } else {
                    navigate('/search')
                  }
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          {/* RIGHT : Switch + Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              badgeContent={67}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '10px', // taille du texte dans le badge
                  height: '16px', // hauteur du badge
                  minWidth: '16px', // largeur mini
                  // lineHeight: '17px', // centre vertical
                  top: 4, // décale vers le bas
                  right: 4 // décale horizontalement
                }
              }}
            >
              <Link to={'/notification'}>
                <IconButton sx={{ fontSize: 17 }}>
                  <FaBell size={17} color="white" />
                </IconButton>
              </Link>
            </Badge>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                borderRadius: '20px',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar alt="User" src={userInfo.photo} sx={{ width: 28, height: 28 }} />
                <FaChevronDown
                  size={10}
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: '70%',
                    transform: 'translateY(-50%)'
                  }}
                />
              </Box>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  width: 180, // <-- largeur désirée
                  color: 'var(--secondary)'
                }
              }}
            >
              <Link to={'/profile'} className={classe.menu}>
                <MenuItem onClick={handleMenuClose}>
                  <FaUser style={{ marginRight: 8 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={logout}>
                  <RiLogoutBoxRLine style={{ marginRight: 8 }} />
                  Déconnection
                </MenuItem>
              </Link>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            borderRight: 'none' // supprime la bordure par défaut du Drawer
          }
        }}
      >
        <DrawerHeader
          sx={{
            minHeight: '40px!important',
            zIndex: 9999
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon size={17} color="var(--secondary)" />
            ) : (
              <ChevronLeftIcon size={17} color="var(--secondary)" />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderBottom: `solid 1px rgba(0, 0, 0, 0.2)!important` }} />
        <List
          dense={true}
          sx={{
            borderRight: `solid 1px rgba(0, 0, 0, 0.2)!important`,
            height: '100%',
            py: 0
          }}
        >
          {/* dashboard */}
          <Link to={'/dashboard'} className={classe.menu}>
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname == '/dashboard' && classe.menuActive}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 32,
                    px: 2
                  },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    },
                    open ? { mr: 2 } : { mr: 'auto' }
                  ]}
                >
                  <FaTachometerAlt size={20} color="var(--primary)" />
                </ListItemIcon>
                <ListItemText
                  primary={'Tableau de bord'}
                  sx={[
                    {
                      color: 'var(--primary)'
                    },
                    open ? { opacity: 1 } : { opacity: 0 }
                  ]}
                />
              </ListItemButton>
            </ListItem>
          </Link>

          {/* etablissement */}
          <Link to={'/etablissement'} className={classe.menu}>
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname == '/etablissement' && classe.menuActive}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 32,
                    px: 2
                  },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    },
                    open ? { mr: 2 } : { mr: 'auto' }
                  ]}
                >
                  <FaSchool size={20} color="var(--primary)" />
                </ListItemIcon>
                <ListItemText
                  primary={'Etablissement'}
                  sx={[
                    {
                      color: 'var(--primary)'
                    },
                    open ? { opacity: 1 } : { opacity: 0 }
                  ]}
                />
              </ListItemButton>
            </ListItem>
          </Link>

          {/* users */}
          <Link to={'/users'} className={classe.menu}>
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname == '/users' && classe.menuActive}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 32,
                    px: 2
                  },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    },
                    open ? { mr: 2 } : { mr: 'auto' }
                  ]}
                >
                  <FaUserFriends size={20} color="var(--primary)" />
                </ListItemIcon>
                <ListItemText
                  primary={'Utilisateurs'}
                  sx={[
                    {
                      color: 'var(--primary)'
                    },
                    open ? { opacity: 1 } : { opacity: 0 }
                  ]}
                />
              </ListItemButton>
            </ListItem>
          </Link>

          {/* classes */}
          <Link to={'/classes'} className={classe.menu}>
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname == '/classes' && classe.menuActive}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 32,
                    px: 2
                  },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    },
                    open ? { mr: 2 } : { mr: 'auto' }
                  ]}
                >
                  <FaUsps size={20} color="var(--primary)" />
                </ListItemIcon>
                <ListItemText
                  primary={'Classes / Niveau'}
                  sx={[
                    {
                      color: 'var(--primary)'
                    },
                    open ? { opacity: 1 } : { opacity: 0 }
                  ]}
                />
              </ListItemButton>
            </ListItem>
          </Link>

          {/* eleves */}
          <Link to={'/eleves'} className={classe.menu}>
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname == '/eleves' && classe.menuActive}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 32,
                    px: 2
                  },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    },
                    open ? { mr: 2 } : { mr: 'auto' }
                  ]}
                >
                  <FaUserGraduate size={20} color="var(--primary)" />
                </ListItemIcon>
                <ListItemText
                  primary={'élèves'}
                  sx={[
                    {
                      color: 'var(--primary)',
                      textTransform: 'capitalize'
                    },
                    open ? { opacity: 1 } : { opacity: 0 }
                  ]}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          minHeight: '100vh',
          overflowX: 'hidden', // 👈 prevent scrollbars
          ml: `calc(${theme.spacing(1)} + 1px)`, // 👈 shift with drawer
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          })
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  )
}
Navigation.propTypes = {
  children: PropTypes.node,
  setSearchItem: PropTypes.string
}

export default Navigation
