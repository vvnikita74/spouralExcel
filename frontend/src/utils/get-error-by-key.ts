import type { FieldErrors } from 'react-hook-form'

export default function getErrorByKey(
	inputKey: string,
	errors: FieldErrors<{ [key: string]: string }>
): string {
	if (!inputKey.includes('.')) {
		return errors[inputKey]?.message
	}

	const keys = inputKey.split('.')

	let current: unknown = errors

	for (const key of keys) {
		if (
			current &&
			typeof current === 'object' &&
			!Array.isArray(current) &&
			key in (current as Record<string, unknown>)
		) {
			current = (current as Record<string, unknown>)[key]
		} else {
			return undefined
		}
	}

	return typeof current === 'object' &&
		current !== null &&
		'message' in current
		? (current as { message: string }).message
		: ''
}
