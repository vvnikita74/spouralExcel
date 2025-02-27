import './index.css'

import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore'

import ErrorHandler from 'layout/error-handler'
import IndexLayout from 'layout/index-layout'
import EmergencyReportPage from 'pages/emergency-report'
import HomePage from 'pages/home'
import LoginPage from 'pages/login'
import ProfilePage from 'pages/profile'

import { QueryClient } from '@tanstack/react-query'
import {
  PersistedClient,
  Persister,
  PersistQueryClientProvider
} from '@tanstack/react-query-persist-client'
import { del, get, set } from 'idb-keyval'

import { deleteMutation, postMutation } from 'utils/mutations'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 86400000,
      staleTime: 2500,
      retry: 0,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst'
    },
    mutations: {
      networkMode: 'offlineFirst'
    }
  }
})

const persister = {
  persistClient: async (client: PersistedClient) => {
    await set('reactQuery', client)
  },
  restoreClient: async () => {
    return await get<PersistedClient>('reactQuery')
  },
  removeClient: async () => {
    await del('reactQuery')
  }
} satisfies Persister

const store = createStore({
  authName: '_auth',
  authType: 'localstorage'
})

queryClient.setMutationDefaults(['req-post'], postMutation)
queryClient.setMutationDefaults(['req-delete'], deleteMutation)

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='login' element={<LoginPage />} />
      <Route element={<AuthOutlet fallbackPath='/login' />}>
        <Route path='/' element={<IndexLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path='profile'
            element={<ProfilePage />}
            errorElement={
              <ErrorHandler msg='Ошибка получения данных пользователя. Пожалуйста, проверьте интернет-соединение' />
            }
          />
          <Route
            path='emergencyreport'
            element={<EmergencyReportPage />}
            loader={({ request }) => {
              const url = new URL(request.url)
              const searchTerm = url.searchParams.get('continue')
              return searchTerm || ''
            }}
            // errorElement={
            //   <ErrorHandler msg='Ошибка получения данных для заполнения. Пожалуйста, проверьте интернет-соединение' />
            // }
          />
        </Route>
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
    onSuccess={() => {
      queryClient.resumePausedMutations()
    }}>
    <AuthProvider store={store}>
      <RouterProvider router={router} />
    </AuthProvider>
  </PersistQueryClientProvider>
)
