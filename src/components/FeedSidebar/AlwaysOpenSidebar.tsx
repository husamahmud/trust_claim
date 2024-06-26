import React from 'react'
import { List, ListItemText, ListItemButton, Button, Box, useMediaQuery, useTheme } from '@mui/material'
import { Home, Search } from '@mui/icons-material'
import CreateIcon from '@mui/icons-material/Create'
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  isAuth: boolean
}

const AlwaysOpenSidebar: React.FC<SidebarProps> = ({ isAuth }) => {
  const theme = useTheme()

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('did')
    localStorage.removeItem('ethAddress')
    navigate('/login')
  }

  return (
    <Box
      style={{
        width: '25vw',
        height: '100vh',
        backgroundColor: theme.palette.footerBackground,
        color: theme.palette.texts,
        position: 'fixed',
        top: 0,
        left: 0,
        marginTop: '64px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <ListItemButton sx={{ gap: '1rem', width: '100%', justifyContent: 'center' }} onClick={() => navigate('/feed')}>
          <Home sx={{ color: theme.palette.texts }} />
          <ListItemText primary='Home' />
        </ListItemButton>
        <ListItemButton
          sx={{ gap: '1rem', width: '100%', justifyContent: 'center' }}
          onClick={() => navigate('/search')}
        >
          <Search sx={{ color: theme.palette.texts }} />
          <ListItemText primary='Search' />
        </ListItemButton>
        {isAuth ? (
          <ListItemButton sx={{ gap: '1rem', width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
            <Button
              variant='contained'
              sx={{
                backgroundColor: theme.palette.buttons,
                color: theme.palette.buttontext,
                width: '100%',
                maxWidth: '16vw',
                '&:hover': {
                  backgroundColor: theme.palette.buttonHover
                }
              }}
            >
              Logout
            </Button>
          </ListItemButton>
        ) : (
          <>
            <ListItemButton
              sx={{ gap: '1rem', width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/login')}
            >
              <Button
                variant='contained'
                sx={{
                  backgroundColor: theme.palette.buttons,
                  color: theme.palette.buttontext,
                  width: '100%',
                  maxWidth: '16vw',
                  '&:hover': {
                    backgroundColor: theme.palette.buttonHover
                  }
                }}
              >
                Login
              </Button>
            </ListItemButton>
            <ListItemButton
              sx={{ gap: '1rem', width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/register')}
            >
              <Button
                variant='contained'
                sx={{
                  backgroundColor: theme.palette.buttons,
                  color: theme.palette.buttontext,
                  width: '100%',
                  maxWidth: '16vw',
                  gap: '1rem',
                  '&:hover': {
                    backgroundColor: theme.palette.buttonHover
                  }
                }}
              >
                Register
              </Button>
            </ListItemButton>
          </>
        )}
      </List>
      {isAuth && (
        <Box sx={{ p: 2, mt: 'auto', mb: '64px', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant='contained'
            startIcon={<CreateIcon />}
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: theme.palette.buttons,
              color: theme.palette.buttontext,
              borderRadius: '30px',
              width: '16vw',
              maxWidth: isSmallScreen ? '16vw' : '100%',
              gap: '1rem',
              '&:hover': {
                backgroundColor: theme.palette.buttonHover
              }
            }}
          >
            Create Claim
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default AlwaysOpenSidebar
