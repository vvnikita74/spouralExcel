import type {
	FieldError,
	UseFormWatch,
	Control,
	FieldValues
} from 'react-hook-form'
import type { MouseEvent } from 'react'
import { ConstructionMaterials } from 'types/field'

import { Fragment, memo, useCallback, useEffect } from 'react'
import SelectInput from './select-input'
import { Controller, useFieldArray } from 'react-hook-form'

import PlusIcon from 'public/icons/plus.svg'
import MinusIcon from 'public/icons/minus.svg'

function getDefsAndRecs(
	data: ConstructionMaterials[],
	targetName: string
): {
	defs: string[]
	recs: string[]
} {
	const targetObject = data.find(item => item.name === targetName)

	if (!targetObject) return { defs: [], recs: [] }

	return targetObject.values.reduce(
		(acc, { def, rec }) => {
			if (def) acc.defs.push(def)
			if (rec) acc.recs.push(rec)
			return acc
		},
		{ defs: [], recs: [] }
	)
}

const DefectsInputs = memo(
	({
		errors,
		values,
		name,
		watchFieldName,
		watch,
		control
	}: {
		errors: {
			def?: { message: string | FieldError }
			rec?: { message: string | FieldError }
		}[]
		values: ConstructionMaterials[]
		name: string
		watchFieldName: string
		watch: UseFormWatch<FieldValues>
		control: Control<FieldValues>
	}) => {
		const material = watch(watchFieldName)

		const { defs, recs } = getDefsAndRecs(values, material)

		const { fields, append, remove } = useFieldArray({
			control,
			name
		})

		const handleDeleteItem = useCallback(
			(event: MouseEvent<HTMLButtonElement>) => {
				const { currentTarget } = event
				const { index } = currentTarget.dataset
				remove(Number(index))
			},
			[remove]
		)

		const handleAddItem = useCallback(
			() => append({ def: '', rec: '' }),
			[append]
		)

		useEffect(() => {
			if (fields.length > 0) remove()
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [material, remove])

		if (defs.length === 0) return null

		if (fields.length === 0)
			return (
				<div className='mt-2.5 flex flex-row items-start justify-between'>
					<span className='base-text px-2.5'>
						Дефекты и рекомендации
					</span>
					<button
						type='button'
						className='base-text base-padding w-fit rounded-xl bg-indigo-500 text-white'
						onClick={handleAddItem}>
						<PlusIcon className='size-5' />
					</button>
				</div>
			)

		return (
			<>
				<span className='base-text mt-2.5 px-2.5'>
					Дефекты и рекомендации
				</span>
				{fields.map((field, index) => (
					<Fragment key={field.id}>
						<div className='mt-2.5 flex flex-col'>
							<Controller
								name={`${name}.${index}.def`}
								control={control}
								render={({ field: arrField }) => (
									<SelectInput
										placeholder='Дефект'
										required={true}
										inputProps={arrField}
										labelProps={{
											className: 'flex flex-col'
										}}
										values={defs}
										error={
											(errors?.[index]?.def?.message as string) || ''
										}
									/>
								)}
							/>
							<Controller
								name={`${name}.${index}.rec`}
								control={control}
								render={({ field: arrField }) => (
									<SelectInput
										placeholder='Рекомендация'
										required={true}
										inputProps={arrField}
										labelProps={{
											className: 'flex flex-col mt-2.5'
										}}
										values={recs}
										error={
											(errors?.[index]?.rec?.message as string) || ''
										}
									/>
								)}
							/>
							<div className='relative mt-2.5 min-h-9 w-full'>
								{index + 1 === fields.length && (
									<button
										type='button'
										className='base-text base-padding w-fit rounded-xl bg-indigo-500 text-white'
										onClick={handleAddItem}>
										<PlusIcon className='size-5' />
									</button>
								)}
								<button
									type='button'
									data-index={index}
									className='base-text base-padding absolute right-0 top-0 w-fit rounded-xl
										bg-indigo-500 text-white'
									onMouseDown={handleDeleteItem}>
									<MinusIcon className='size-5' />
								</button>
							</div>
						</div>
					</Fragment>
				))}
			</>
		)
	}
)

export default DefectsInputs
