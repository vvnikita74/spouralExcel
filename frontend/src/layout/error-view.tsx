import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ConnectOffIcon from 'assets/icons/connect-off.svg?react'

import { useWebConnectionContext } from './global-context'

export default function ErrorView() {
	const navigate = useNavigate()
	const webConnection = useWebConnectionContext()
	const location = useLocation()

	useEffect(() => {
		if (location.state?.msg) {
			alert(location.state.msg || 'Внутренняя ошибка')
			navigate(location.pathname, { state: null })
		}
	}, [location, navigate])

	if (!webConnection)
		return (
			<div
				className='pointer-events-none ml-4 w-fit rounded-xl border border-red-500 p-1.5
					text-red-500'>
				<ConnectOffIcon className='size-6' />
			</div>
		)

	return null
}
