{
	"options": {
		"host": "https://payments.testwithbolt.com",
		"shared_key": "1357_14774",
		"secret_key": "86f443508074a30df0e0c2c1e7a10b27"
	},
	"setup": [{
		"options": {
			"host": "https://payments.testwithbolt.com",
			"company_name": "Jim's Shoe Shop",
			"company_country": "US",
			"contact_name": "Jim Doe",
			"contact_phone": "+1614123456",
			"contact_email": "jim@email.com"
		},
		"button": "eyJpbnN0YW5jZV9rZXkiOiJ0ZXN0MiIsImhvc3QiOiJodHRwczovL3BheW1lbnRzLnRlc3R3aXRoYm9sdC5jb20iLCJjb21wYW55X25hbWUiOiJKaW0ncyBTaG9lIFNob3AiLCJjb21wYW55X2NvdW50cnkiOiJVUyIsImNvbnRhY3RfbmFtZSI6IkppbSBEb2UiLCJjb250YWN0X3Bob25lIjoiKzE2MTQxMjM0NTYiLCJjb250YWN0X2VtYWlsIjoiamltQGVtYWlsLmNvbSJ9",
		"signature_timestamp": "123",
		"signature": "1357_14774-123-45b8a1bcc9b5a54d394f7f5f9469eef8",
		"url": "https://payments.testwithbolt.com/c/setup/#/api/setup/eyJob3N0IjoiaHR0cHM6Ly9wYXltZW50cy50ZXN0d2l0aGJvbHQuY29tIiwiY29tcGFueV9uYW1lIjoiSmltJ3MgU2hvZSBTaG9wIiwiY29tcGFueV9jb3VudHJ5IjoiVVMiLCJjb250YWN0X25hbWUiOiJKaW0gRG9lIiwiY29udGFjdF9waG9uZSI6IisxNjE0MTIzNDU2IiwiY29udGFjdF9lbWFpbCI6ImppbUBlbWFpbC5jb20ifQ==/eyJzaWduYXR1cmUiOiIxMzU3XzE0Nzc0LTE1OTE3MTc0MjMyODgtYzA4ZDBlYTE0MDFhZTYwZDZiNGZkNTIzM2VmNDQ1NjQifQ=="
	}],
	"payment": [{
		"instance_key": "test2",
		"options": {
			"host": "https://payments.testwithbolt.com",
			"currency": "GBP",
		    "amount": 1, 
			"alt_key": "1234",
			"description": "About the payment",
			"source": "moto",
		    "account": {
		        "alt_key": "ID1",
		        "first_name": "James",
		        "last_name": "Boer",
		        "company": "Jinky's Lollie Shop",
		        "email": "james@jinkies.com",
		        "phone": "0712345678",
		        "address": {  
		            "line1": "1 High St",
		            "line4": "London",
		            "line5": "W10 6RU",
		            "country": "GB"
		        }
		    },
		    "success_url": "https://jinkies.com/receipt",
		    "nonce": "TEST"
		},
		"button": "eyJpbnN0YW5jZV9rZXkiOiJ0ZXN0MiIsImhvc3QiOiJodHRwczovL3BheW1lbnRzLnRlc3R3aXRoYm9sdC5jb20iLCJjdXJyZW5jeSI6IkdCUCIsImFtb3VudCI6MSwiYWx0X2tleSI6IjEyMzQiLCJkZXNjcmlwdGlvbiI6IkFib3V0IHRoZSBwYXltZW50Iiwic291cmNlIjoibW90byIsImFjY291bnQiOnsiYWx0X2tleSI6IklEMSIsImZpcnN0X25hbWUiOiJKYW1lcyIsImxhc3RfbmFtZSI6IkJvZXIiLCJjb21wYW55IjoiSmlua3kncyBMb2xsaWUgU2hvcCIsImVtYWlsIjoiamFtZXNAamlua2llcy5jb20iLCJwaG9uZSI6IjA3MTIzNDU2NzgiLCJhZGRyZXNzIjp7ImxpbmUxIjoiMSBIaWdoIFN0IiwibGluZTQiOiJMb25kb24iLCJsaW5lNSI6IlcxMCA2UlUiLCJjb3VudHJ5IjoiR0IifX0sInN1Y2Nlc3NfdXJsIjoiaHR0cHM6Ly9qaW5raWVzLmNvbS9yZWNlaXB0Iiwibm9uY2UiOiJURVNUIn0=",
		"signature_timestamp": "123",
		"signature": "1357_14774-123-28258d5fae56540e199b933e5fe5258d",
		"url": "https://payments.testwithbolt.com/c/web/api/doPayment?q=eyJpbnN0YW5jZV9rZXkiOiJ0ZXN0MiIsImhvc3QiOiJodHRwczovL3BheW1lbnRzLnRlc3R3aXRoYm9sdC5jb20iLCJjdXJyZW5jeSI6IkdCUCIsImFtb3VudCI6MSwiYWx0X2tleSI6IjEyMzQiLCJkZXNjcmlwdGlvbiI6IkFib3V0IHRoZSBwYXltZW50Iiwic291cmNlIjoibW90byIsImFjY291bnQiOnsiYWx0X2tleSI6IklEMSIsImZpcnN0X25hbWUiOiJKYW1lcyIsImxhc3RfbmFtZSI6IkJvZXIiLCJjb21wYW55IjoiSmlua3kncyBMb2xsaWUgU2hvcCIsImVtYWlsIjoiamFtZXNAamlua2llcy5jb20iLCJwaG9uZSI6IjA3MTIzNDU2NzgiLCJhZGRyZXNzIjp7ImxpbmUxIjoiMSBIaWdoIFN0IiwibGluZTQiOiJMb25kb24iLCJsaW5lNSI6IlcxMCA2UlUiLCJjb3VudHJ5IjoiR0IifX0sInN1Y2Nlc3NfdXJsIjoiaHR0cHM6Ly9qaW5raWVzLmNvbS9yZWNlaXB0Iiwibm9uY2UiOiJURVNUIn0=&signature=1357_14774-1591717509281-e0a2fcc51cc47bfb02e035c68d5ccf0f",
		"doPayment_defaults": {
			"nonce": null, 
			"payment_method": {
				"card_number": "4242424242424242",
				"card_cvc": "123",
				"card_expiry": "10/20"
			}
		}
	}]
}