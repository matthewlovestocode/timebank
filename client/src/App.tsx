import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './components/pages/HomePage'
import { DashboardPage } from './components/pages/DashboardPage'
import { SignInPage } from './components/pages/SignInPage'
import { SignUpPage } from './components/pages/SignUpPage'
import { TopNavigation } from './components/navigation/TopNavigation'
import { clientConfig } from './config/env'
import { useDemoAuth } from './hooks/useDemoAuth'

function App() {
  const auth = useDemoAuth(clientConfig.apiUrl)
  const navigation = <TopNavigation user={auth.user} onSignOut={auth.signOut} />

  return (
    <Routes>
      <Route path="/" element={<HomePage navigation={navigation} />} />
      <Route path="/dashboard" element={<DashboardPage navigation={navigation} />} />
      <Route
        path="/sign-in"
        element={
          <SignInPage
            authenticated={Boolean(auth.user)}
            status={auth.status}
            navigation={navigation}
            onSignIn={auth.signIn}
          />
        }
      />
      <Route
        path="/sign-up"
        element={
          <SignUpPage
            authenticated={Boolean(auth.user)}
            onSignUp={auth.signUp}
            navigation={navigation}
            status={auth.status}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
