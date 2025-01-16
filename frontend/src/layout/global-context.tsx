import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'

import { Network } from '@capacitor/network'
import { onlineManager } from '@tanstack/react-query'

type GlobalSetters = {
	setWebConnection: React.Dispatch<React.SetStateAction<boolean>>
}

const WebConnectionStateContext = createContext<boolean | null>(null)

const GlobalSettersContext = createContext<GlobalSetters | null>(null)

export const useWebConnectionContext = (): boolean =>
	useContext(WebConnectionStateContext)

export const useGlobalSettersContext = (): GlobalSetters =>
	useContext(GlobalSettersContext)

// TODO: Убрать в отдельный компонент без контекста
export default function GlobalContext({ children }) {
	const [webConnection, setWebConnection] = useState<boolean>(true)

	const setters = useMemo(
		() => ({ setWebConnection }),
		[setWebConnection]
	)

	useEffect(() => {
		const checkStatus = async () => {
			const status = await Network.getStatus()
			setWebConnection(status.connected)
		}

		checkStatus()

		Network.addListener('networkStatusChange', status => {
			setWebConnection(status.connected)
		})

		return () => {
			Network.removeAllListeners()
		}
	}, [])

	useEffect(() => {
		onlineManager.setOnline(webConnection)
	}, [webConnection])

	return (
		<GlobalSettersContext.Provider value={setters}>
			<WebConnectionStateContext.Provider value={webConnection}>
				{children}
			</WebConnectionStateContext.Provider>
		</GlobalSettersContext.Provider>
	)
}
