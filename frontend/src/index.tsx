import './index.css'

import ReactDOM from 'react-dom/client'

import {
	createBrowserRouter,
	createRoutesFromElements,
	redirect,
	Route,
	RouterProvider
} from 'react-router-dom'

import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit'
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'

import IndexLayout from './layout/index-layout'
import LoginPage from './pages/login'
import HomePage from './pages/home'
import EmergencyReportPage from './pages/emergency-report'

import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { API_URL } from 'utils/config'

const store = createStore({
	authName: '_auth',
	authType: 'localstorage'
})

const getAuthStore = () => {
	const { userState, auth } = store.tokenObject.value || {
		userState: null,
		auth: null
	}

	const authHeader = `${auth?.type} ${auth?.token}`

	return { userState, authHeader }
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24,
			staleTime: 1000 * 60 * 60 * 24,
			retry: false,
			refetchOnWindowFocus: false,
			networkMode: 'offlineFirst'
		}
	}
})

const persister = createSyncStoragePersister({
	storage: window.localStorage
})

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route
				path='login'
				element={<LoginPage />}
				loader={async () => {
					const { userState } = getAuthStore()
					if (userState) return redirect('/')
					return null
				}}
			/>
			<Route
				element={<AuthOutlet fallbackPath='/login' />}
				errorElement={null}>
				<Route path='/' element={<IndexLayout />}>
					<Route index element={<HomePage />} />
					<Route
						path='emergencyreport'
						element={<EmergencyReportPage />}
						loader={async () => {
							const { authHeader } = getAuthStore()

							return queryClient.fetchQuery({
								queryKey: ['emergencyreport'],
								queryFn: async () => {
									try {
										const req = await fetch(`${API_URL}/data`, {
											headers: {
												Authorization: authHeader
											}
										})
										return req.json()
									} catch {
										return (
											queryClient.getQueryData([
												'emergencyreport'
											]) || null
										)
									}
								},
								staleTime: 7200
							})
						}}
					/>
				</Route>
			</Route>
		</>
	)
)

ReactDOM.createRoot(document.getElementById('root')!).render(
	<PersistQueryClientProvider
		client={queryClient}
		persistOptions={{ persister }}>
		<AuthProvider store={store}>
			<RouterProvider router={router} />
		</AuthProvider>
	</PersistQueryClientProvider>
)
