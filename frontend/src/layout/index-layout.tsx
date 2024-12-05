import { Link, Outlet } from 'react-router-dom'

import logoIcon from 'public/images/logo-icon.webp'
import ProfilePanel from 'components/profile/profile-panel'
import GlobalContext from './global-context'

export default function IndexLayout() {
	return (
		<GlobalContext>
			<main className='relative size-full overflow-hidden p-4'>
				<div
					className='sticky top-[calc(var(--safe-area-inset-top,0px))] flex w-full
						flex-row justify-between'>
					<Link to='/'>
						<img
							src={logoIcon}
							alt='СПО-Урал'
							loading='lazy'
							className='h-10 w-auto object-contain sm:h-[2.69rem]'
						/>
					</Link>
					<ProfilePanel />
				</div>
				<div className='scrollbar-hide mt-4 h-[calc(100dvh-4.5rem)] overflow-scroll pb-4'>
					<Outlet />
				</div>
			</main>
		</GlobalContext>
	)
}
