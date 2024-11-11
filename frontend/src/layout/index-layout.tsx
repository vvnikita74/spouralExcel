import ProfilePanel from 'components/profile/profile-panel'
import Logo from 'public/icons/logo.svg'
import { Outlet } from 'react-router-dom'

export default function IndexLayout() {
	return (
		<main className='relative size-full overflow-hidden p-4'>
			<div
				className='top-[calc(var(--safe-area-inset-top, 0px)+1rem)] sticky flex
					w-full flex-row justify-between'>
				<Logo className='h-10 w-auto object-contain text-indigo-500 sm:h-[43px]' />
				<ProfilePanel />
			</div>
			<div className='scrollbar-hide h-[calc(100dvh-4.5rem)] overflow-scroll'>
				<Outlet />
			</div>
		</main>
	)
}
