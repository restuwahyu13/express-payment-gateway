import { dateFormat } from '../utils/util.date'
import { rupiahFormatter } from '../utils/util.rupiah'

interface ITopupMail {
	from: string
	to: string
	subject: string
	html: string
}

export const tempMailTopup = (to: string, method: string, amount: number): ITopupMail => {
	return {
		from: 'admin@bfintech.com',
		to: to,
		subject: 'Top up Saldo Successfully',
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
                    text-align: ceimport { rupiahFormatter } from './../utils/util.rupiah';
nter;
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
                        <p class="card-subtitle"><strong>Kepada user YTH </strong>Berikut adalah bukti topup anda:
                    </p>
									<div class="text-content">
									  <h4>Topup Saldo Berhasil</h4>
										<p>
										  Selamat <b>${to}</b> anda telah berhasil melakukan topup saldo sebesar <b>${rupiahFormatter(amount.toString())}</b>
										</p>
										 <ul>
											<li>
												<b>Penerima</b>: ${to}
											</li>
											<li>
												<b>Jumlah</b>: ${rupiahFormatter(amount.toString())}
											</li>
											<li>
											  <b>Payment</b>: ${method}
											</li>
											 <li>
											  <b>Tanggal</b>: ${dateFormat(new Date()).format('lll')}
											 </li>
										 </ul>
                    <div class="footer-logo">
                        <span class="footer">&copy; ${new Date().getFullYear()} Barbar Fintech, Inc All Right Reserved</span>
                        </div>
                    </div>
                </div>
            </div>
          </body>
      </html>
        `
	}
}
