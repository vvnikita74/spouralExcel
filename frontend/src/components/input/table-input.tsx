import type { Control, FieldValues } from 'react-hook-form'
import type { TableFieldCell } from 'types/field'
import type { MouseEvent } from 'react'

import { useFieldArray } from 'react-hook-form'
import { memo, useCallback } from 'react'

import PlusIcon from 'public/icons/plus.svg'
import MinusIcon from 'public/icons/minus.svg'

const TableInput = memo(
	({
		name,
		label,
		cells,
		control,
		errors
	}: {
		name: string
		label: string
		cells: TableFieldCell[]
		control: Control<FieldValues>
		errors: Array<{ [key: string]: { message: string } }>
	}) => {
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
			() =>
				append(
					cells.reduce(
						(acc, cell) => ({ ...acc, [cell.key]: '' }),
						{}
					)
				),
			[append, cells]
		)

		return (
			<div className='flex flex-col'>
				<div className='flex flex-row items-center justify-between'>
					<span className='title-text block min-h-9'>{label}</span>
					{fields.length === 0 && (
						<button
							type='button'
							className='base-text base-padding w-fit rounded-xl bg-indigo-500 text-white'
							onClick={handleAddItem}>
							<PlusIcon className='size-5' />
						</button>
					)}
				</div>
				{fields.map((field, index) => (
					<div key={field.id} className='mt-4 flex flex-col'>
						{cells.map(cell => {
							const error = errors[index]?.[cell.key]?.message

							return (
								<label
									className='mt-2.5 flex flex-col first:mt-0'
									key={cell.key}
									htmlFor={`${name}.${index}.${cell.key}`}>
									<input
										{...control.register(
											`${name}.${index}.${cell.key}`
										)}
										className={error ? 'input-error' : ''}
										placeholder={cell.label}
									/>
									<span
										className={`block text-right text-sm text-red-500
										${error ? 'h-5 opacity-100' : 'h-0 opacity-0'}`}
										id='error-text'>
										{error || ''}
									</span>
								</label>
							)
						})}
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
				))}
			</div>
		)
	}
)

export default TableInput
