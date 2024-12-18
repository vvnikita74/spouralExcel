import './index.css'

import ReactDOM from 'react-dom/client'

import {
	createBrowserRouter,
	createRoutesFromElements,
	defer,
	redirect,
	Route,
	RouterProvider
} from 'react-router-dom'

import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore'

import IndexLayout from 'layout/index-layout'
import EmergencyReportPage from 'pages/emergency-report'
import HomePage from 'pages/home'
import LoginPage from 'pages/login'
import ProfilePage from 'pages/profile'

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

import { reqPostMutation } from 'utils/mutations'
import queryFetch from 'utils/query-fetch'

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24,
			staleTime: 2500,
			retry: 1,
			refetchOnWindowFocus: false,
			networkMode: 'offlineFirst'
		},
		mutations: {
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
		[objKey]: queryFetch(queryClient, queryKey, authHeader, path)
	})
}

queryClient.setMutationDefaults(['req-post'], reqPostMutation)

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
			<Route element={<AuthOutlet fallbackPath='/login' />}>
				<Route path='/' element={<IndexLayout />}>
					<Route index element={<HomePage />} />
					<Route
						path='profile'
						element={<ProfilePage />}
						loader={() =>
							getLoader('user/data', ['user-data'], 'userData')
						}
					/>
					<Route
						path='emergencyreport'
						element={<EmergencyReportPage />}
						loader={() =>
							getLoader('data', ['emergency-report-fields'], 'fields')
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
		persistOptions={{ persister }}
		onSuccess={() => {
			queryClient.resumePausedMutations()
		}}>
		<AuthProvider store={store}>
			<RouterProvider router={router} />
		</AuthProvider>
		{/* <ReactQueryDevtools initialIsOpen /> */}
	</PersistQueryClientProvider>
)
