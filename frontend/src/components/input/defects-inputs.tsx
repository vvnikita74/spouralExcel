import { memo } from 'react'
import type { FieldError } from 'react-hook-form'
const DefectsInputs = memo(
	({
		errors
	}: {
		errors: {
			def?: { message: string | FieldError }
			rec?: { message: string | FieldError }
		}[]
	}) => {
		console.log(errors)

		return null
	}
)

export default DefectsInputs
