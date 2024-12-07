import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'

type GlobalSetters = {
	setWebConnection: React.Dispatch<React.SetStateAction<boolean>>
}

const WebConnectionStateContext = createContext<boolean | null>(
	null
)

const GlobalSettersContext = createContext<GlobalSetters | null>(
	null
)

export const useWebConnectionContext = (): boolean =>
	useContext(WebConnectionStateContext)

export const useGlobalSettersContext = (): GlobalSetters =>
	useContext(GlobalSettersContext)

export default function GlobalContext({ children }) {
	const [webConnection, setWebConnection] = useState<boolean>(
		navigator.onLine
	)

	const setters = useMemo(
		() => ({ setWebConnection }),
		[setWebConnection]
	)

	useEffect(() => {
		const updateNetworkStatus = () => {
			setWebConnection(navigator.onLine)
		}

		window.addEventListener('online', updateNetworkStatus)
		window.addEventListener('offline', updateNetworkStatus)

		return () => {
			window.removeEventListener('online', updateNetworkStatus)
			window.removeEventListener('offline', updateNetworkStatus)
		}
	}, [])

	return (
		<GlobalSettersContext.Provider value={setters}>
			<WebConnectionStateContext.Provider value={webConnection}>
				{children}
			</WebConnectionStateContext.Provider>
		</GlobalSettersContext.Provider>
	)
}
