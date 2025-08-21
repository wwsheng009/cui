import React, { useState } from 'react'
import { InputComponentProps } from '../../types'
import ErrorMessage from '../ErrorMessage'
import styles from './index.less'
import commonStyles from '../common.less'

export default function InputPassword({ schema, value, onChange, error, hasError }: InputComponentProps) {
	const [showPassword, setShowPassword] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const inputClass = `${styles.passwordInput} ${hasError ? commonStyles.error : ''}`

	return (
		<div className={commonStyles.inputContainer}>
			<div className={styles.passwordContainer} data-1p-ignore data-lpignore data-form-type='other'>
				<input
					className={inputClass}
					type={showPassword ? 'text' : 'password'}
					value={String(value || '')}
					onChange={handleChange}
					placeholder={schema.placeholder}
					disabled={schema.disabled}
					readOnly={schema.readOnly}
					minLength={schema.minLength}
					maxLength={schema.maxLength}
					autoComplete='new-password'
					data-form-type='other'
				/>
				<button
					type='button'
					className={styles.toggleButton}
					onClick={togglePasswordVisibility}
					disabled={schema.disabled || schema.readOnly}
					tabIndex={-1}
				>
					{showPassword ? (
						<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
							<path
								d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					) : (
						<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
							<path
								d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					)}
				</button>
			</div>
			<ErrorMessage message={error} show={hasError} />
		</div>
	)
}
