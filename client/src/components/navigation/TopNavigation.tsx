import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { Avatar, Box, Menu, MenuItem, Typography } from '@mui/material'
import { ActionButton } from '../primitives/ActionButton'
import { IconActionButton } from '../primitives/IconActionButton'
import { NavigationSurface } from '../primitives/NavigationSurface'
import type { AuthUser } from '../../hooks/useDemoAuth'
import { useColorMode } from '../../theme/useColorMode'

type TopNavigationProps = {
  user: AuthUser | null
  onSignOut: () => Promise<void>
}

export function TopNavigation({ user, onSignOut }: TopNavigationProps) {
  const navigate = useNavigate()
  const { mode, toggleColorMode } = useColorMode()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

  const signOut = async () => {
    setMenuAnchor(null)
    await onSignOut()
    navigate('/')
  }

  return (
    <NavigationSurface>
      <Typography
        component={Link}
        to="/"
        variant="h6"
        sx={{
          mr: 'auto',
          color: 'text.primary',
          cursor: 'pointer',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Timebank
      </Typography>
      <IconActionButton
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        onClick={toggleColorMode}
      >
        {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
      </IconActionButton>
      {user ? (
        <>
          <IconActionButton
            aria-label="Open account menu"
            onClick={(event) => setMenuAnchor(event.currentTarget)}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user.name.slice(0, 1).toUpperCase()}
            </Avatar>
          </IconActionButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            slotProps={{ paper: { sx: { minWidth: 280 } } }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
            <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
            <MenuItem onClick={signOut}>Sign out</MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <ActionButton variant="text" onClick={() => navigate('/sign-in')}>
            Sign in
          </ActionButton>
          <ActionButton variant="contained" onClick={() => navigate('/sign-up')}>
            Sign up
          </ActionButton>
        </>
      )}
    </NavigationSurface>
  )
}
