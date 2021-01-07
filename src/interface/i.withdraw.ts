/**
=============================
Find  Transfer Amount Teritory
=============================
*/

export interface IFindWithdrawAmount {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_withdraw_amount: number
}

export interface IFindParamsWithdrawAmount {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_withdraw_amount: number
}

type FindSubNewWithdrawAmount = {
	readonly transfer_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly nominal_withdraw: string
	readonly tanggal_withdraw: any
}

type FindNewWithdrawAmount = {
	readonly user_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly total_nominal_withdraw: string | number
	readonly total_withdraw: FindSubNewWithdrawAmount[]
}

export interface IFindNewWithdrawAmount {
	readonly withdraw_history: FindNewWithdrawAmount
}

/**
=============================
Find History Transfer Amount Teritory
=============================
*/

export interface IFindWithdrawAmountHistory {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly withdraw_id: number
	readonly withdraw_amount: number
	readonly withdraw_time: any
}

export interface IFindParamsWithdrawAmountHistory {
	readonly user_id: number
}

export interface IFindNewParamsWithdrawAmountHistory {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly withdraw_id: number
	readonly withdraw_amount: number
	readonly withdraw_time: any
}

export interface IFinNewdWithdrawAmountHistory {
	readonly transfer_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly nominal_withdraw: string
	readonly tanggal_withdraw: any
}
