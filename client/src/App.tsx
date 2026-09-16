import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './components/pages/HomePage'
import { DashboardPage } from './components/pages/DashboardPage'
import { ExchangesPage } from './components/pages/ExchangesPage'
import { LedgerPage } from './components/pages/LedgerPage'
import { ListingsPage } from './components/pages/ListingsPage'
import { AdminCategoriesPage } from './components/pages/AdminCategoriesPage'
import { AdminMembersPage } from './components/pages/AdminMembersPage'
import { ProfilePage } from './components/pages/ProfilePage'
import { ListingDetailPage } from './components/pages/ListingDetailPage'
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
      <Route path="/profile" element={<ProfilePage navigation={navigation} user={auth.user} status={auth.status} onSave={auth.updateProfile} />} />
      <Route path="/exchanges" element={<ExchangesPage navigation={navigation} />} />
      <Route path="/ledger" element={<LedgerPage navigation={navigation} />} />
      <Route path="/listings" element={<ListingsPage navigation={navigation} />} />
      <Route path="/marketplace/listings/:listingId" element={<ListingDetailPage navigation={navigation} user={auth.user} />} />
      <Route path="/admin/categories" element={<AdminCategoriesPage navigation={navigation} />} />
      <Route path="/admin/members" element={<AdminMembersPage navigation={navigation} />} />
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
