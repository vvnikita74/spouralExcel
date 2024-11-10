import './index.css'

import ReactDOM from 'react-dom/client'

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from 'react-router-dom'

import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit'
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'

import LoginPage from './pages/login'
import HomePage from './pages/home'

const store = createStore({
	authName: '_auth',
	authType: 'localstorage'
})

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path='/login' element={<LoginPage />} />
			<Route
				element={<AuthOutlet fallbackPath='/login' />}
				errorElement={null}>
				<Route path='/' element={<HomePage />} />
			</Route>
		</>
	)
)

ReactDOM.createRoot(document.getElementById('root')!).render(
	<AuthProvider store={store}>
		<RouterProvider router={router} />
	</AuthProvider>
)
