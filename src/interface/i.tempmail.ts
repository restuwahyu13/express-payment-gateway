export interface ITopupMail {
	readonly from: string
	readonly to: string
	readonly subject: string
	readonly html: string
}

export interface IRegisterMail {
	readonly from: string
	readonly to: string
	readonly subject: string
	readonly html: string
}

export interface IResendMail {
	readonly from: string
	readonly to: string
	readonly subject: string
	readonly html: string
}

export interface IResetMail {
	readonly from: string
	readonly to: string
	readonly subject: string
	readonly html: string
}

export interface ITransferMail {
	readonly from: string
	readonly to: string
	readonly subject: string
	readonly html: string
}

export interface IWithdrawMail {
	readonly from: string
	readonly to: string
	readonly subject: string
	readonly html: string
}
