import React, { FC, useState } from 'react'
import CurrencyType from '../../types/CurrencyType'

import styles from './CurrencyPicker.module.scss'

interface CurrencyPickerProps {
	list: CurrencyType[]
	currentCurrency: CurrencyType
	updateCurrentCurrency: (newCurrentCurrency: CurrencyType) => void
}

const CurrencyPicker: FC<CurrencyPickerProps> = ({
	list,
	currentCurrency,
	updateCurrentCurrency,
}) => {
	const [open, setOpen] = useState<boolean>(false)

	const onClickListItem = (obj: CurrencyType) => {
		setOpen(false)
		updateCurrentCurrency(obj)
	}

	return (
		<div className={styles.root} onClick={() => setOpen(!open)}>
			<div className={styles.title}>
				{currentCurrency.CharCode} ({currentCurrency.Name})
			</div>
			{open && (
				<div className={styles.dropdown}>
					{list.map(item => (
						<ul
							className={styles.dropdownItem}
							key={item.ID}
							onClick={() => onClickListItem(item)}
						>
							<li>
								{item.CharCode} ({item.Name})
							</li>
						</ul>
					))}
				</div>
			)}
		</div>
	)
}

export default CurrencyPicker
