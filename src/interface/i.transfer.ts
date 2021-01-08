/**
=============================
Find  Transfer Amount Teritory
=============================
*/

export interface IFindTransferFrom {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_transfer_amount: number
	readonly transfer_to: number
	readonly transfer_from: number
}

export interface IFindParamsTransferFrom {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_transfer_amount: number
	readonly transfer_to: number
}

type FindSubNewTransferFrom = {
	readonly transfer_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly nominal_transfer: string | number
	readonly tanggal_transfer: any
}

type FindNewTransferFrom = {
	readonly user_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly total_nominal_transfer: string | number
	readonly total_transfer: FindSubNewTransferFrom[]
}

export interface IFindNewTransferFrom {
	readonly transfer_history: FindNewTransferFrom
}

/**
=============================
Find History Transfer Amount Teritory
=============================
*/

export interface IFindTransferTo {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly transfer_id: number
	readonly transfer_to: number
	readonly transfer_from: number
	readonly transfer_amount: number
	readonly transfer_time: any
}

export interface IFindParamsTransferTo {
	readonly transfer_to: number
	readonly transfer_from: number
}

export interface IFindNewParamsTransferTo {
	readonly email: string
	readonly noc_transfer: number
	readonly transfer_id: number
	readonly transfer_amount: number
	readonly transfer_time: any
}

export interface IFindNewTransferTo {
	readonly transfer_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly nominal_transfer: string | number
	readonly tanggal_transfer: any
}
