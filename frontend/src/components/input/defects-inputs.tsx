import { memo } from 'react'
import type { FieldError } from 'react-hook-form'
const DefectsInputs = memo(
	({
		errors
	}: {
		errors: {
			[key: string]:
				| FieldError
				| {
						[key: string]: { message: string }
				  }[]
		}
	}) => {
		console.log(errors)

		return null
	}
)

export default DefectsInputs
