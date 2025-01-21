import type { Control, FieldValues } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import type { TableFieldCell } from 'types/field'

export default function TableInput({
	name,
	cells,
	control
}: {
	name: string
	cells: TableFieldCell[]
	control: Control<FieldValues>
}) {
	const { fields, append, remove } = useFieldArray({
		control,
		name
	})

	return (
		<div className='flex flex-col'>
			{fields.map((field, index) => (
				<div key={field.id}>
					{cells.map(cell => (
						<input
							key={cell.key}
							{...control.register(`${name}.${index}.${cell.key}`)}
							placeholder={cell.label}
						/>
					))}
					<button type='button' onClick={() => remove(index)}>
						Удалить
					</button>
				</div>
			))}

			<button
				type='button'
				onClick={() =>
					append(
						cells.reduce(
							(acc, cell) => ({ ...acc, [cell.key]: '' }),
							{}
						)
					)
				}>
				Добавить элемент
			</button>
		</div>
	)
}
