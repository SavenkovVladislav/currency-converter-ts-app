import React, { FC, ChangeEvent, useEffect, useState, useCallback } from 'react'
import CurrencyPicker from './components/CurrencyPicker/CurrencyPicker'
import CurrencyType from './types/CurrencyType'
import debounce from 'lodash.debounce'

import { ReactComponent as Loader } from './assets/icons/loader.svg'

import styles from './App.module.scss'

const initCurrentCurrencyState = {
	CharCode: 'AED',
	ID: 'R01230',
	Name: 'Дирхам ОАЭ',
	Nominal: 1,
	NumCode: '784',
	Previous: 22.9587,
	Value: 22.8596,
}

const App: FC = () => {
	const [loading, setLoading] = useState<boolean>(true)
	const [list, setList] = useState<CurrencyType[]>([]) // данные с сервера
	const [inputValue, setInputValue] = useState(0) // value инпута в который вводится сумма в валюте
	const [localInputValue, setLocalInputValue] = useState('') // локальное value инпута в который вводится сумма в валюте
	const [currentCurrency, setCurrentCurrency] = useState<CurrencyType>(
		initCurrentCurrencyState
	) // текущая валюта
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		fetch('https://www.cbr-xml-daily.ru/daily_json.js')
			.then(response => {
				if (!response.ok) {
					throw new Error()
				}
				return response.json()
			})
			.then(data => {
				const dataArray: CurrencyType[] = Object.values(data.Valute)
				setList(dataArray)
			})
			.catch(error => {
				setError(error)
			})
			.finally(() => {
				setLoading(false)
			})

		// получаем данные из localStorage по ключу 'currentCurrency'
		const savedСurrentCurrency = localStorage.getItem('currentCurrency')
		if (savedСurrentCurrency) {
			setCurrentCurrency(JSON.parse(savedСurrentCurrency))
		}
	}, [])

	// записываем данные в localStorage по ключу 'currentCurrency'
	useEffect(() => {
		localStorage.setItem('currentCurrency', JSON.stringify(currentCurrency))
	}, [currentCurrency])

	// функция обновления inputValue
	const updateValue = useCallback(
		debounce(value => {
			setInputValue(value)
		}, 1000),
		[]
	)

	const updateCurrentCurrency = (newCurrentCurrency: CurrencyType) => {
		setCurrentCurrency(newCurrentCurrency)
	}

	const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
		setLocalInputValue(event.target.value)
		updateValue(event.target.value)
	}

	return (
		<div className={styles.root}>
			{loading ? (
				<div>
					<Loader />
				</div>
			) : error ? (
				<div>Ошибка</div>
			) : (
				<div className={styles.content}>
					<h1>Конвертер валют</h1>
					<input
						className={styles.input}
						type='text'
						placeholder='Сумма в валюте'
						value={localInputValue}
						onChange={onChangeInput}
					/>
					<CurrencyPicker
						list={list}
						currentCurrency={currentCurrency}
						updateCurrentCurrency={updateCurrentCurrency}
					/>
					<div className={styles.inputWrapper}>
						<input
							className={styles.input}
							type='text'
							placeholder='Сумма в рублях'
							readOnly
							value={
								(currentCurrency.Value / currentCurrency.Nominal) *
								Number(inputValue)
							}
						/>
						<span>&#8381;</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default App
