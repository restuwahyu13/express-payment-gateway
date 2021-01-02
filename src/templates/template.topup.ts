import { dateFormat } from '../utils/util.date'

const CLIENT_URL = process.env.NODE_ENV !== 'production' ? process.env.URL_DEV : process.env.URL_PROD

interface ITopupMail {
	from: string
	to: string
	subject: string
	html: string
}

export const tempMailTopup = (to: string, amount: number): ITopupMail => {
	return {
		from: 'admin@bfintech.com',
		to: to,
		subject: 'Top up Balance Successfuly',
		html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Tech Soft</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
                html, body {
                    font-family: "Roboto Thin";
                    clear: both;
                    margin: auto;
                    padding: auto;
                }
                .container {
                    position: relative !important;
                    margin: auto !important;
                    text-align: center;
                    width: 650px;
                    height: 650px;
                    border-radius: 10px;
                }
                .container .card {
                    justify-content: center;
                    align-content: center;
                    position: relative;
                    top: 30px;
                }
                .container .logo {
                    background: blue;
                    width: 360px;
                    height: 40px;
                    border-radius: 10px;
                    position: relative;
                    margin: auto;
                    text-align: center;
                    font-weight: bold;
                }
                .logo h4 a {
                    font-size: 22px;
                    text-align: center;
                    line-height: 40px;
                    color: #f5f5f5;
                    opacity: 1;
                }
                .card-title {
                    font-size: 19px;
                    line-height: 30px;
                }
                .card-subtitle {
                    font-size: 17px;
                }
                .list-accout {
                    font-size: 16px;
                    position: relative;
                    top: 20px;
                }
                .button-spotify {
                    position: relative;
                    justify-content: center;
                }
                a {
                    display: inline-block;
                    position: relative;
                    margin: auto;
                    text-decoration: none;
                    color: white;
                    font-weight: bold;
                    outline: none;
                    box-shadow: none;
                    font-size: 15px;
								}
								ul li {
									list-style: none;
									display: block;
								}
                button {
                    width: 150px;
                    height: 50px;
                    border-radius: 10px;
                    background: blue;
                    position: relative;
                    top: 10px;
                    font-weight: bold;
                    font-size: 18px;
                    color: #f5f5f5;
                    opacity: 1;
                }
                .text-content {
                    font-size: 16px;
                    word-wrap: break-word;
                    position: relative;
                    top: 55px;
                }
                .footer-logo{
                    background: blue;
                    color: #f5f5f5;
                    width: 360px;
                    height: 40px;
                    border-radius: 15px;
                    position: relative;
                    margin: auto;
                    text-align: center;
                    top: 3vh;
                    font-weight: bold;
                }
                .footer {
                    font-size: 17px;
                    line-height: 40px;
                    text-align: center;
                    opacity: 1;
                }
            </style>
        </head>
        <body>
        <div class="container">
            <div class="card">
                <div class="logo">
                    <h4><a href="">Barbar Fintech Company</a></h4>
                </div>
                <div class="card-body">
                    <p class="card-title"><strong>Hello Dear ${to}</strong></p>
                        <p class="card-subtitle"><strong>Kepada user YTH </strong>Berikut adalah bukti ticket topup anda:
                    </p>
									<div class="text-content">
									  <h4>Topup Balance Successfully</h4>
										<p>
										  selamat <b>${to}</b> anda telah berhasil melakukan topup saldo sebesar <b>Rp.${amount}</b>
										</p>
										 <ul>
											<li>
												Penerima: ${to}
											</li>
											<li>
												Balance: Rp.${amount}
											</li>
											 <li>
											  Tanggal: ${dateFormat(new Date()).format()}
											 </li>
										 </ul>
                    <div class="footer-logo">
                        <span class="footer">&copy; 2021 Barbar Fintech, Inc All Right Reserved</span>
                        </div>
                    </div>
                </div>
            </div>
          </body>
      </html>
        `
	}
}
