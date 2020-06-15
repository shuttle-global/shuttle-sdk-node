# Shuttle Node.js SDK

Shuttle is the easiest way to integrate payment processing into your software. Shuttle is NOT a payment processor but rather connects to major processors in each territory.

The ideal use case is working with a B2B SaaS platform that offers merchants the ability collect payments into their own merchant account (ie the SaaS platform does not try to get in the way of funds ie is the "merchant of record") - for example an ecommerce platform. In this scenario, merchants value the ability to choose their preferred payment processor rather than be prescribed a limited choice like only offering Stripe or Paypal.


## Introduction

This library is designed to simplify your integration with Shuttle for platforms written with node.js. We provide a number of technicques for integration:

* Popovers: We provide a hosted popover setup and payment process, designed to appear "integrated" with your platform. The use of a hosted payment process can shield you from PCI DSS requirements of handling card details. Note for popovers to work, you will need to include a reference to the following file to your webpage:

`<script src="https://app.shuttleglobal.com/b/web/s/payments-1.1.X.min.js">`

* Redirect URLs: If you wish to use a hosted setup & payment process but prefer not to popover your existing platform, you can redirect instead, these pages will be hosted from Shuttle's domain.

* Serverside: These are performed entirely by serverside API and do not have a user interface component. Note: The use of APIs which handle card details require your platform to be PCI DSS compiant, are only available in our white-labelled product. You can still however use the popover and redirect techniques.


### Installation

You can install via npm:
```
npm install @shuttleglobal/shuttle-sdk-node
```


## Setup / Onboarding


### Client Side - Setup Popup

Adding a payments setup button to your software that launches a popup or redirect is easy, you simply need to include our JS library, and then add a "Setup Payments" link or button to your page. The button requires two HTML attributes `data-shuttle-setup` and `data-shuttle-signature` as such:

```
<button data-shuttle-setup="setup_encoded_string" data-shuttle-signature="signature_encoded_string">Setup Payments</button>
```

Where the encoded strings are generated server side via our library;

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var options = {
	instance_key: "ABC1234",
	company_name: "Jim's Shoe Shop",
	company_country: "US",
	contact_name: "Jim Doe",
	contact_phone: "+1614123456",
	contact_email: "jim@gmail.com",
};

var setup_encoded_string = shuttle.setupButton(options);
var signature_encoded_string = shuttle.setupSignature(options);

var html_button = '<button data-shuttle-setup="' + setup_encoded_string + '" data-shuttle-signature="' + signature_encoded_string + '">Setup Payments</button>'

// OR you can create a setup URL to redirect the user to

var setup_url = payments.setupUrl(options);
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#7027a5f1-8ae3-46fe-80e6-8d206a62dad1) for available options.

First time users will be required to supply all the above fields during account creation, any fields not passed in the "options" will be prompted to the user.


### API - Get Payments Setup

You can check if an instance has been activated and configured for payments, by calling `getSetup`.

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";

shuttle.getSetupPayments(instance_key)
.then((result) => {
	console.log("Result: " + JSON.stringify(result));
});
```
```
Where result:
{
	id: "1234",
	application: "1023_123",
	instance_key: "ABC1234",
	active: true,
	payments_ready: true,
	company_name: "Shuttle",
	contact_name: "Phil Peters",
	contact_email: "phil@paywithbolt.com",
	contact_phone: "+447985918872",
	card_types: ["VISA", "MASTERCARD", "AMEX", "PAYPAL"],
	currencies: ["USD", "GBP"]
}
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#e14370d0-8e8c-4e61-b80e-fc1e474be3e2) for further information on the data returned.


## Payments and Refunds

### Client Side - Payment Popup

Adding a payments popup is also easy, you simply need to include our JS library, and then add a "Payment" link or button to your page. The button requires two attributes `data-shuttle-payment` and `data-shuttle-signature` as such

```
<button data-shuttle-payment="payment_encoded_string" data-shuttle-signature="signature_encoded_string">Pay</button>
```

Where the encoded strings are generated serverside via our library, for example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var options = {
	instance_key: "1000",
	currency: "GBP",
	amount: 100,
	alt_key: "1234",
	description: "About the payment",
	source: "moto",
	account: {
		alt_key: "yourCustomerId",
		first_name: "James",
		last_name: "Boer",
		company: "Jinky's Lollie Shop",
		email: "james@jinkies.com",
		phone: "0712345678",
		address: {
			line1: "1 High St",
			line4: "London",
			line5: "W10 6RU",
			country: "GB"
		}
	},
	success_url: "https://jinkies.com/receipt"
};

var payment_encoded_string = shuttle.paymentButton(options);
var signature_encoded_string = shuttle.paymentSignature(options);

var html_button = '<button data-shuttle-payment="' + setup_encoded_string + '" data-shuttle-signature="' + signature_encoded_string + '">Pay</button>'
```
Please refer [here](https://api.shuttleglobal.com/?version=latest#9dd09218-5f9c-4e04-a19f-105607a75c8a) for options available.


OR you can create a payment URL to redirect the user to

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";

var options = {
	payment: {
		currency: "GBP",
		amount: 100,
		alt_key: "1234",
		description: "About the payment",
		source: "moto",
		account: {
			alt_key: "eyJob3N0IjoiaHR0cHM6Ly9wYXltZW50cy53aXRoYm9sdC5jb20iLCJub25jZSI6IlRFU1QiLCJjaGFubmVsS2V5Ijoid2ViIiwiImluc3RhbmNlS2V5IjoiQUJDMTIzNCIsImFsdEtleSI6IjEyMzQiLCJjdXJyZW5jeSI6IkdCUCIsImFtb3VudCI6MSwib3JkZXJEZXNjIjoiQWJvdXQgdGhlIHBheW1lbnQiLCJpc0N1c3RvbWVyUHJlc2VudCI6ZmFsc2UsImlzU3RhZmZQcmVzZW50Ijp0cnVlLCJkaXNhYmxlTXlEZXRhaWxzIjoiVFJVRSJ9",
			first_name: "James",
			last_name: "Boer",
			company: "Jinky's Lollie Shop",
			email: "james@jinkies.com",
			phone: "0712345678",
			address: {
				line1: "1 High St",
				line4: "London",
				line5: "W10 6RU",
				country: "GB"
			}
		},
		success_url: "https://jinkies.com/receipt"
	}
};

var payment_url_promise = shuttle.paymentUrl(instance_key, options)
.then((result) => {
	// On Success
	console.log("Result: " + JSON.stringify(result));
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```
```
Result:
{
	"url": "https://payments.123456789.testwithbolt.com/c/web/#/api/payment/eyJob3N0IjoiaHR0cHM6Ly9wYXltZW50cy53aXRoYm9sdC5jb20iLCJub25jZSI6IlRFU1QiLCJjaGFubmVsS2V5Ijoid2ViIiwiY3JtIjp7ImFkZHJlc3MiOnsiY291bnRyeSI6IkdCIiwibGluZTEiOiIxIEhpZ2ggU3QiLCJsaW5lNCI6IkxvbmRvbiIsImxpbmU1IjoiVzEwIDZSVSJ9LCJjcm1rZXkiOiJJRDEiLCJmaXJzdG5hbWUiOiJKYW1lcyIsImxhc3RuYW1lIjoiQm9lciIsImNvbXBhbnkiOiJKaW5reSdzIExvbGxpZSBTaG9wIiwiZW1haWwiOiJqYW1lc0BqaW5raWVzLmNvbSIsInBob25lIjoiMDcxMjM0NTY3OCJ9LCJpbnN0YW5jZUtleSI6IjEyMzEyMzEyMyIsImFsdEtleSI6IjEyMzQiLCJjdXJyZW5jeSI6IkdCUCIsImFtb3VudCI6MSwib3JkZXJEZXNjIjoiQWJvdXQgdGhlIHBheW1lbnQiLCJpc0N1c3RvbWVyUHJlc2VudCI6ZmFsc2UsImlzU3RhZmZQcmVzZW50Ijp0cnVlLCJkaXNhYmxlTXlEZXRhaWxzIjoiVFJVRSIsInNlc3Npb25LZXkiOiI0NmIxMjkzMTZiZWQ2YmIxNWU1ZWUwMTJjNDQxMzAwOCJ9"
}
```
 
Please refer [here](https://api.shuttleglobal.com/?version=latest#2ede352b-e4e8-494b-9d24-f8d8f1fd2b83) for options available, and the data returned.


### API - Create a Payment

You can perform a payment request server side via `promise = shuttle.doPayment(instance_key, options)`. A new payment will be attempted, unless the payment is rejected prior to processing the API request will succeed and return a payment object in a SUCCESS or DECLINE status. If however the payment is rejected due to a validation rule (eg no card data), no payment will be created. For example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";

var options = {
	payment: {
		currency: "GBP",
		amount: 100,
		alt_key: "1234",
		description: "About the payment",
		source: "moto",
		account: {
			alt_key: "yourCustomerId",
			first_name: "James",
			last_name: "Boer",
			company: "Jinky's Lollie Shop",
			email: "james@jinkies.com",
			phone: "0712345678",
			address: {
				line1: "1 High St",
				line4: "London",
				line5: "W10 6RU",
				country: "GB"
			}
		},
		payment_method: {
			card_number: "4444333322221111",
			card_cvc: "123",
			card_expiry: "1222",
			save_card: true
		}
	}
};

var payment_promise = shuttle.doPayment(instance_key, options)
.then((result) => {
	// On Success
	console.log("Result: " + JSON.stringify(result));
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```
```
Result:
{
	"payment": {
		"id": "pay_11842_10000",
		"alt_key": "1234",
		"description": "Invoice 1234",
		"source": "MOTO",
		"action": "PAYMENT",
		"status": "SUCCESS",
		"gateway_status": "APPROVED",
		"gateway_reference": "ch_1GVaEEFi2CnH4uN3ouw69fw3",
		"authorisation_code": "pi_1GVaEEFi2CnH4uN355ZdZvk5 (TEST)",
		"reference": "BOLT-00010000",
		"amount": "100",
		"balance": "100",
		"settle_currency": "GBP",
		"settle_gross_amount": "100",
		"settle_net_amount": "96.9",
		"settle_fee_amount": "3.1",
		"currency": "GBP",
		"channel": "ch_11842_10001",
		"initiative": "in_11842_10000",
		"designation": "des_11842_10000",
		"legal_entity": "le_11842_10000",
		"gateway": "gw_11842_10000",
		"account": "acc_11842_10000",
		"payment_method": "pm_11842_10000",
		"contract": "co_11842_10000",
		"created": "2020-04-08T09:29:48.000Z",
		"updated": "2020-04-08T09:29:52.000Z",
		"processed": "2020-04-08T09:29:51.000Z"
	},
	"contract": {
		"account": "acc_11842_10000",
		"alt_key": "1234",
		"amount": "100",
		"channel": "ch_11842_10001",
		"completed": "2020-04-08T09:29:52.000Z",
		"created": "2020-04-08T09:29:48.000Z",
		"currency": "GBP",
		"description": "Invoice 1234",
		"designation": "des_11842_10000",
		"gateway": "gw_11842_10000",
		"id": "co_11842_10000",
		"initiated": "2020-04-08T09:29:48.000Z",
		"initiative": "in_11842_10000",
		"last_transaction": "tr_11842_10000",
		"legal_entity": "le_11842_10000",
		"payment_method": "pm_11842_10000",
		"recurring": false,
		"split": false,
		"status": "COMPLETED",
		"updated": "2020-04-08T09:29:52.000Z"
	},
	"transaction": {
		"id": "tr_11842_10000",
		"action": "PAYMENT",
		"source": "MOTO",
		"status": "SUCCESS",
		"gateway_status": "APPROVED",
		"gateway_reference": "ch_1GVaEEFi2CnH4uN3ouw69fw3",
		"authorisation_code": "pi_1GVaEEFi2CnH4uN355ZdZvk5 (TEST)",
		"reference": "BOLT-00010000",
		"amount": "100",
		"balance": "100",
		"settle_currency": "GBP",
		"settle_gross_amount": "100",
		"settle_net_amount": "96.9",
		"settle_fee_amount": "3.1",
		"currency": "GBP",
		"channel": "ch_11842_10001",
		"initiative": "in_11842_10000",
		"designation": "des_11842_10000",
		"legal_entity": "le_11842_10000",
		"gateway": "gw_11842_10000",
		"account": "acc_11842_10000",
		"payment_method": "pm_11842_10000",
		"contract": "co_11842_10000",
		"created": "2020-04-08T09:29:48.000Z",
		"updated": "2020-04-08T09:29:52.000Z",
		"processed": "2020-04-08T09:29:51.000Z"
	}
}
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#fe184f65-c12c-41c0-84cc-34e6b611a13b) for options available, and the data returned.



### API - Get a Payment

You can request payment details via the API using `promise = shuttle.getPayment(instance_key, payment_key)`. The payment details will be returned. If however the payment is rejected due to a validation rule (eg no card data), no payment will be created. For example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";
var payment_key = "1234";

var payment_promise = shuttle.getPayment(instance_key, payment_key)
.then((result) => {
	// On Success
	console.log("Result: " + JSON.stringify(result));
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```
```
Result:
{
	"payment": {
		"id": "pay_11842_10000",
		"alt_key": "1234",
		"description": "Invoice 1234",
		"source": "MOTO",
		"action": "PAYMENT",
		"status": "SUCCESS",
		"gateway_status": "APPROVED",
		"gateway_reference": "ch_1GVaEEFi2CnH4uN3ouw69fw3",
		"authorisation_code": "pi_1GVaEEFi2CnH4uN355ZdZvk5 (TEST)",
		"reference": "BOLT-00010000",
		"amount": "100",
		"balance": "100",
		"settle_currency": "GBP",
		"settle_gross_amount": "100",
		"settle_net_amount": "96.9",
		"settle_fee_amount": "3.1",
		"currency": "GBP",
		"channel": "ch_11842_10001",
		"initiative": "in_11842_10000",
		"designation": "des_11842_10000",
		"legal_entity": "le_11842_10000",
		"gateway": "gw_11842_10000",
		"account": "acc_11842_10000",
		"payment_method": "pm_11842_10000",
		"contract": "co_11842_10000",
		"created": "2020-04-08T09:29:48.000Z",
		"updated": "2020-04-08T09:29:52.000Z",
		"processed": "2020-04-08T09:29:51.000Z"
	}
}
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#f90d1766-b96c-46da-a2ca-434cb8ba99cd) for further documentation.



### API - Refund a Payment

You can refund part of all of a payment, via `promise = shuttle.doRefund(instance_key, payment_key, options)`, for example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "1000";
var payment_key = "pay_1000_1234"; 

var options = {
	refund: {
		amount: "100",
		reason: "Customer requested refund"
	}
};

var payment_promise = shuttle.doRefund(instance_key, payment_key, options)
.then((result) => {
	// On Success
	console.log("Result: " + JSON.stringify(result));
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```  
```
Result:
{
	"refund": {
		"id": "ref_1000_31792",
		"payment": "pay_1000_1234",
		"amount": "100",
		"reason": "Optional description why"
		"status": "SUCCESS",
		"gateway_status": "APPROVED",
		"reference": "BOLT-00031792",
		"created": "2019-01-23T10:24:31.000Z",
		"processed": "2019-01-23T10:24:31.000Z"
	}
}
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#af3ca5a7-6c9f-4f39-8e06-77079f408af2) for further documentation.

### API - Get a Refund

You can request payment details via the API using `promise = shuttle.getRefund(instance_key, payment_key)`. The refund details will be returned. If however the payment is rejected due to a validation rule (eg no card data), no payment will be created. For example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";
var payment_key = "1234";

var payment_promise = shuttle.getPayment(instance_key, payment_key)
.then((result) => {
	// On Success
	console.log("Result: " + JSON.stringify(result));
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```
```
Result:
{
	"refund": {
		"id": "ref_1000_31792",
		"payment": "pay_1000_1234",
		"amount": "100",
		"reason": "Optional description why"
		"status": "SUCCESS",
		"gateway_status": "APPROVED",
		"reference": "BOLT-00031792",
		"created": "2019-01-23T10:24:31.000Z",
		"processed": "2019-01-23T10:24:31.000Z"
	}
}
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#f90d1766-b96c-46da-a2ca-434cb8ba99cd) for further documentation.


## Tokenisation

### Client Side - Tokenisation Popup

Adding a tokenisation popup allows you to add or select a payment method - you can also pass a list of contracts which will assign the selected payment method to those contracts. You need to include our JS library, and then add a "Add Payment Method" link or button to your page. The button requires two attributes `data-shuttle-select-token` and `data-shuttle-signature` as such

```
<button data-shuttle-select-token="select_token_encoded_string" data-shuttle-signature="signature_encoded_string">Pay</button>
```

Where the encoded strings are generated serverside via our library, for example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var options = {
	instance_key: "1000",
	account: "1000_1234",
	contracts: ["10000_10038"],
	title: "Update Payment Details"
};

var select_token_encoded_string = shuttle.selectTokenButton(options);
var signature_encoded_string = shuttle.selectTokenSignature(options);

var html_button = '<button data-shuttle-select-token="' + select_token_encoded_string + '" data-shuttle-signature="' + signature_encoded_string + '">Pay</button>'

// OR you can create a payment URL to redirect the user to

var payment_url = shuttle.selectTokenUrl(options);
```
 
Please refer [here](https://api.shuttleglobal.com/?version=latest#db3aef10-ab7e-4971-9b24-de533923b4e8) for options available.

## API Wrapper

### API - GET

You can call any API GET endpoint using `promise = shuttle.apiGet(instance_key, endpoint)`. Where endpoint is the URL after the /instances/{instance}. For example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";

var payment_promise = shuttle.apiGet(instance_key, "/setup/payments")
.then((result) => {
	// On Success
	console.log("Result: " + JSON.stringify(result));
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```
```
Result:
{
	id: "1234",
	application: "1023_123",
	instance_key: "ABC1234",
	active: true,
	payments_ready: true,
	company_name: "Shuttle",
	contact_name: "Phil Peters",
	contact_email: "phil@paywithbolt.com",
	contact_phone: "+447985918872",
	card_types: ["VISA", "MASTERCARD", "AMEX", "PAYPAL"],
	currencies: ["USD", "GBP"]
}
```


Please refer [here](https://api.shuttleglobal.com/?version=latest#a258cf7f-84d5-416c-b434-a8aeafb5c32b) for further documentation.



### API - POST

You can call any API GET endpoint using `promise = shuttle.apiPost(instance_key, endpoint, body)`. Where endpoint is the URL after the /instances/{instance}. For example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";
var body = {
	"deep_link": {
			"type": "merchant",
			"context": {
				"module": "enquiry",
				"action": "view_contract",
				"id": "12344",
				"menu": "banner",
				"menu_logo": "https://myserver.com/wp-content/uploads/2018/03/logo-tm-RGB-hq-transp.png",
				"favicon": "https://myserver.com/wp-content/themes/favicon.ico",
				"return_url": "https://myserver.com/"		
			},
			"user": {
				"alt_key": "1234",
				"name": "John Doe"
			},
			"session": {
				"teams": ["ADMIN"]
			},
			"expiry_seconds": 900		
		}
};

var payment_promise = shuttle.apiPost(instance_key, "/deep_links", body)
.then((result) => {
	// On Success
	console.log("Result: " + JSON.stringify(result));
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```
```
Result:
{
	"deep_link": {
	"id": "fbj30rphiop3fefi2d8lmwh5oithcfys",
	"type": "merchant",
	"context": {
		"module": "enquiry",
		"action": "view_contract",
		"id": "12344",
		"menu": "banner",
		"menu_logo": "https://myserver.com/wp-content/uploads/2018/03/logo-tm-RGB-hq-transp.png",
		"favicon": "https://myserver.com/wp-content/themes/favicon.ico",
		"return_url": "https://myserver.com/"
	},
	"user": {
		"alt_key": "1234",
		"name": "John Doe"
	},
	"session": {
		"teams": [
			"ADMIN"
		]
	},
	"expiry_seconds": 900
	}
}
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#a258cf7f-84d5-416c-b434-a8aeafb5c32b) for further documentation.


### API - PUT

You can call any API GET endpoint using `promise = shuttle.apiPut(instance_key, endpoint, body)`. Where endpoint is the URL after the /instances/{instance}. For example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";
var contract_key = "123";
var body = {
	"contract": {
		"next_charge": "now"
	}
};

var payment_promise = shuttle.apiPut(instance_key, "/contracts/" + contract_key, body)
.then((result) => {
	// On Success
	console.log("Result: " + JSON.stringify(result));
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```
```
Result:
{
	"contract": {
		"id": "co_1000_36914",
		"alt_key": "00036913",
		"account": "acc_1000_19104",
		"payment_method": "pm_1000_22726",
		"currency": "GBP",
		"amount": "200",
		"frequency": "MONTHLY",
		"next_charge": "2019-04-10T10:00:00.000Z",
		"status": "ACTIVE",
		"description": "UK Compassion & more",
		"created": "2019-01-16T09:57:48.000Z",
		"updated": "2019-01-18T10:44:33.000Z",
		"initiated": "2019-01-16T09:57:48.000Z"
	}
}
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#a258cf7f-84d5-416c-b434-a8aeafb5c32b) for further documentation.


### API - DELETE

You can call any API GET endpoint using `promise = shuttle.apiDelete(instance_key, endpoint)`. Where endpoint is the URL after the /instances/{instance}. For example:

```
var Shuttle = require ("@shuttleglobal/shuttle-sdk-node");

var shuttle = new Shuttle({
	shared_key: "your shared key",
	secret_key: "your secret key"
});

var instance_key = "ABC1234";
var deeplink = "kdl22cqhg0mzl2r0f4wiaodqcbgznbh0";

var payment_promise = shuttle.apiDelete(instance_key, "/deeplinks/" + deeplink)
.then(() => {
	// On Success
	console.log("Success");
}).catch((err) => {
	// On Error
	console.log("Result: " + JSON.stringify(result));
});
```
```
Success
```

Please refer [here](https://api.shuttleglobal.com/?version=latest#a258cf7f-84d5-416c-b434-a8aeafb5c32b) for further documentation.
