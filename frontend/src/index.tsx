import './index.css'

import ReactDOM from 'react-dom/client'

import {
	createBrowserRouter,
	createRoutesFromElements,
	redirect,
	defer,
	Route,
	RouterProvider
} from 'react-router-dom'

import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit'
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'

import IndexLayout from 'layout/index-layout'
import LoginPage from 'pages/login'
import HomePage from 'pages/home'
import EmergencyReportPage from 'pages/emergency-report'
import ProfilePage from 'pages/profile'

import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { API_URL } from 'utils/config'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24,
			staleTime: 1000 * 60,
			retry: false,
			refetchOnWindowFocus: false,
			networkMode: 'offlineFirst'
		}
	}
})

const persister = createSyncStoragePersister({
	storage: window.localStorage
})

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

const getLoader = (path = '', queryKey = [''], objKey = '') => {
	const { authHeader } = getAuthStore()

	return defer({
		[objKey]: queryClient.fetchQuery({
			queryKey,
			queryFn: async () => {
				try {
					const req = await fetch(`${API_URL}/${path}`, {
						headers: {
							Authorization: authHeader
						}
					})

					return req.json()
				} catch {
					return queryClient.getQueryData(queryKey) || null
				}
			}
		})
	})
}

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
						path='profile'
						element={<ProfilePage />}
						loader={() =>
							getLoader('user-data', ['user-data'], 'userData')
						}
					/>
					<Route
						path='emergencyreport'
						element={<EmergencyReportPage />}
						loader={() =>
							getLoader('data', ['emergency-report'], 'fields')
						}
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
