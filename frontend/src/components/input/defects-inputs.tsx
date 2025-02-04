import type {
	Control,
	FieldError,
	FieldValues
} from 'react-hook-form'
import type {
	ConstructionType,
	ConstructionMaterials
} from 'types/field'
import type { MouseEvent } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useCallback, memo } from 'react'
import SelectInput from './select-input'

import PlusIcon from 'public/icons/plus.svg'
import MinusIcon from 'public/icons/minus.svg'

const DefectsInputs = memo(
	({
		inputKey,
		name,
		placeholder,
		required,
		construction_type,
		errors,
		control
	}: {
		inputKey: string
		control: Control<
			{
				[key: string]: string
			},
			unknown
		>
		errors: {
			[key: string]:
				| FieldError
				| {
						[key: string]: { message: string }
				  }[]
		}
		name: string
		placeholder: string
		required: boolean
		construction_type: ConstructionType
	}) => {
		console.log(errors)

		return (
			<>
				<Controller
					name={`${inputKey}.type`}
					control={control}
					key={`${inputKey}.type`}
					render={({ field }) => (
						<SelectInput
							placeholder={placeholder || ''}
							label={name}
							inputProps={field}
							required={required}
							values={
								construction_type.materials.map(item => item.name) ||
								[]
							}
							error={(errors?.type as FieldError)?.message || ''}
						/>
					)}
				/>
				<RelatedSelects
					name={`${inputKey}.values`}
					control={control}
					label='Дефекты и рекомендации'
					values={construction_type.materials}
					errors={
						errors?.values as Array<{
							[key: string]: { message: string }
						}>
					}
				/>
			</>
		)
	}
)

export default DefectsInputs

function RelatedSelects({
	name,
	label,
	values,
	control,
	errors
}: {
	name: string
	label: string
	values: Array<ConstructionMaterials>
	control: Control<FieldValues>
	errors: Array<{ [key: string]: { message: string } }>
}) {
	return null
}
