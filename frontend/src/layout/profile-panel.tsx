import UserIcon from 'assets/icons/user.svg?react'
import { Link } from 'react-router-dom'

import useAuthUser from 'react-auth-kit/hooks/useAuthUser'

export default function ProfilePanel({ className = '' }) {
	const { username } = (useAuthUser() as {
		username: string
	}) || { username: ' ' }

	return (
		<Link
			to='/profile'
			className={`base-padding flex flex-row items-center overflow-hidden rounded-xl
				bg-indigo-500 text-white ${className}`}>
			<UserIcon className='mr-1.5 size-6' />
			<span className='base-text'>
				{username || 'Неизвестный пользователь'}
			</span>
		</Link>
	)
}
