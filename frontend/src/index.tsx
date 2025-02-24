import './index.css'

import ReactDOM from 'react-dom/client'

import {
	createBrowserRouter,
	createRoutesFromElements,
	defer,
	Route,
	RouterProvider
} from 'react-router-dom'

import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore'

import IndexLayout from 'layout/index-layout'
import ErrorHandler from 'layout/error-handler'
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
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { del, get, set } from 'idb-keyval'

import { postMutation } from 'utils/mutations'
import queryFetch from 'utils/query-fetch'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 86400000,
			staleTime: 86400000,
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

queryClient.setMutationDefaults(['req-post'], postMutation)

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
						loader={() =>
							getLoader('user/data', ['user-data'], 'userData')
						}
					/>
					<Route
						path='emergencyreport'
						element={<EmergencyReportPage />}
						errorElement={
							<ErrorHandler msg='Ошибка получения данных для заполнения' />
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
			<ReactQueryDevtools />
		</AuthProvider>
	</PersistQueryClientProvider>
)
