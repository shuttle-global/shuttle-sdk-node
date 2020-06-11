const rp = require('request-promise');
const crypto = require('crypto');
const _ = require('lodash');

class Shuttle {
	constructor(options){
		if (!options || !options.shared_key)
			throw "options.shared_key required";
		if (!options.secret_key)
			throw "options.secret_key required";
		
		this.shared_key = options.shared_key;
		this.secret_key = options.secret_key;
		this.host = options.host || "https://payments.withbolt.com";
	}

	_sign(methodName, options) {
		if (!this.shared_key || !this.secret_key || !methodName || !options)
			throw "missing mandatory fields to generate a signature";

		const timestamp = options._timestamp || new Date().getTime();

		// Copy the request so we dont manipulate the original object and remove reserved words
		let signatureBody = JSON.parse(JSON.stringify(options));
		signatureBody = JSON.stringify(_.omit(signatureBody, "host", "nonce"));

		return `${this.shared_key}-${timestamp}-${crypto.createHash('md5').update(timestamp + methodName + signatureBody + this.secret_key).digest("hex")}`;
	}

	_request(method, instance_key, endpoint, body) {
		return rp({
			method: method,
            uri: `${this.host}/c/api/instances/${instance_key}${endpoint}`,
            auth: {
                "user": this.secret_key
            },
            headers: [{
                name: "content-type",
                value: "application/json"
            }],
			json: body
		}).then((response) => {
			return _.isString(response) ? JSON.parse(response) : response;
		}).catch((err) => {
			this._handleError(err);
		});
	}

	apiGet (instance_key, endpoint) {
		return this._request("GET", instance_key, endpoint);
	}

	apiPost (instance_key, endpoint, body) {
		return this._request("POST", instance_key, endpoint, body);
	}

	apiPut (instance_key, endpoint, body) {
		return this._request("PUT", instance_key, endpoint, body);
	}

	apiDelete (instance_key, endpoint) {
		return this._request("DELETE", instance_key, endpoint);
	}

	setupButton (options) {
		return new Buffer(JSON.stringify(options)).toString("base64");
	}

	setupSignature (options) {
		return this._sign("doSetup", options);
	}

	setupUrl (options) {
		return `${this.host}/c/${options.channel_key || "setup"}/#/api/setup/${new Buffer(JSON.stringify(options)).toString("base64")}/${new Buffer(JSON.stringify({ signature: this._sign("doSetup", options) })).toString("base64")}`;
	}

	getSetupPayments (instance_key) {
		return this.apiGet(instance_key, `/setup/payments`);
	}

	paymentButton (options) {
		return new Buffer(JSON.stringify(options)).toString("base64");
	}
 
 	paymentSignature (options) {
		return this._sign("doPayment", options);
	}

	paymentUrl (options) {
		return `${this.host}/c/${options.channel_key || "web"}/api/doPayment?q=${new Buffer(JSON.stringify(options)).toString("base64")}&signature=${this._sign("doPayment", options)}`;
	}

	doPayment(instance_key, payment) {
		return this.apiPost(instance_key, `/payments`, payment);
	}

	getPayment(instance_key, payment_key) {
		return this.apiGet(instance_key, `/payments/${payment_key}`);
	}

	doRefund(instance_key, payment_key, refund) {
		return this.apiPost(instance_key, `/payments/${payment_key}/refund`, refund);
	}

	getRefund(instance_key, refund_key) {
		return this.apiGet(instance_key, `/refunds/${refund_key}`);
	}
	
	selectTokenButton (instance_key, options) {
		options = _.defaults({ instance_key: instance_key }, options);
		return new Buffer(JSON.stringify(options)).toString("base64");
	}
 
	selectTokenSignature (instance_key, options) {
		options = _.defaults({ instance_key: instance_key }, options);
		return this._sign("selectToken", options);
	}

	selectTokenUrl (instance_key, options) {
		options = _.defaults({ instance_key: instance_key }, options);
		return `${this.host}/c/${options.channel_key || "web"}/api/selectToken?q=${new Buffer(JSON.stringify(options)).toString("base64")}&signature=${this._sign("selectToken", options)}`;
	}

	_handleError(err) {
		let error = err.error || err;
		if(_.isString(error)) {
			try {
				error = JSON.parse(error);
			} catch(e) {}
		}

		if(error.errorMessages) {
			let errorCode = ((error.errorMessages || [])[0] || {}).code;
			error.code = errorCode == "BOLT-1119" || errorCode == "1158" ? "FORBIDDEN" : errorCode || "UNKNOWN";
			error.message = _.reduce(error.errorMessages, (message, error) => {
			    if(error.message.match(/{[0-9]}/) && error.field) {
                    error.message = error.message.replace(/{[0-9]}/, error.field);
                }
                return `${message}${message ? ", " : ""}${error.message}`;
            }, "");
		}

		throw {
			"code": error.code || err.statusCode || "UNKNOWN",
			"message": error.message || error
		};
	}

}

module.exports = Shuttle;