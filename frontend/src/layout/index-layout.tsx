import { Link, Outlet } from 'react-router-dom'

import logoIcon from 'public/images/logo-icon.webp'

import ErrorView from 'layout/error-view'
import GlobalContext from 'layout/global-context'
import ProfilePanel from 'layout/profile-panel'

export default function IndexLayout() {
	return (
		<GlobalContext>
			<main className='relative size-full overflow-hidden px-4 py-3'>
				<div className='z-10 flex w-full flex-row justify-between'>
					<div className='relative flex flex-row items-center justify-start'>
						<Link to='/'>
							<img
								src={logoIcon}
								alt='СПО-Урал'
								loading='lazy'
								className='h-10 w-auto object-contain sm:h-[2.69rem]'
							/>
						</Link>
						<ErrorView />
					</div>
					<ProfilePanel />
				</div>
				<div className='scrollbar-hide mt-4 h-[calc(100dvh-4.5rem)] overflow-scroll pb-4'>
					<Outlet />
				</div>
			</main>
		</GlobalContext>
	)
}
