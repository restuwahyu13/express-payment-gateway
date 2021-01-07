import { Request, Express } from 'express'
import multer, { StorageEngine, Multer } from 'multer'
import { resolve } from 'path'
import { existsSync, unlink } from 'fs'

const diskStorage: StorageEngine = multer.diskStorage({
	destination: (req: Request, file: Express.Multer.File, done): void => {
		if (!file) return done(new Error('Upload file error'), null)

		const fileExits = existsSync(resolve(process.cwd(), `src/images/${file.originalname}`))
		if (!fileExits) return done(null, resolve(process.cwd(), 'src/images'))

		unlink(resolve(process.cwd(), `src/images/${file.originalname}`), (error: any): void => {
			if (error) return done(null, error)
			return done(null, resolve(process.cwd(), 'src/images'))
		})
	},
	filename: (req: any, file: Express.Multer.File, done): void => {
		if (file) {
			const extFile = file.originalname.replace('.', '')
			const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile)
			if (!extPattern) return done(new TypeError('File format is not valid'), null)
			req.photo = file.originalname
			return done(null, file.originalname)
		}
	}
})

export const fileUpload: Multer = multer({ storage: diskStorage, limits: { fileSize: 1000000 } })
