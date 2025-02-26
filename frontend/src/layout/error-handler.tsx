import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ErrorHandler({ msg = '' }) {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { state: { msg } })
  }, [navigate, msg])

  return null
}
