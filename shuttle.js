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
            uri: `${this.host}/c/api` + (instance_key ? `/instances/${instance_key}` : "" )+ endpoint,
            auth: {
                "user": this.secret_key
            },
            headers: [{
                name: "content-type",
                value: "application/json"
            }],
			json: body
		}).then((response) => {
			if(method == "DELETE") {
				return;
			}
			return _.isString(response) ? JSON.parse(response) : response;
		}).catch((err) => {
			this._handleError(err);
		});
	}

	_serialiseRequestQuery(options) {
        return options ? _.reduce(options, (str, val, key) => {
            return `${str}${(str ? "&" : "")}${key}=${val}`;
        }, "") : "";
    }

	apiGet (instance_key, endpoint, options) {
		return this._request("GET", instance_key, endpoint + (options ? (endpoint.indexOf("?") !== -1 ? "&" : "?") + this._serialiseRequestQuery(options) : ""));
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
		console.warn("Deprecated 20200601");
		return new Buffer(JSON.stringify(options)).toString("base64");
	}

	setupSignature (options) {
		console.warn("Deprecated 20200601");
		return this._sign("doSetup", options);
	}

	setupUrl (instance_key, options) {
		return this.apiPost(instance_key, `/deep_links`, {
			"deep_link": {
				"type": "gateway-setup",
				"context": options,
				"user": options.user,
				"session": {
					"teams": ["ADMIN"]
				}
			}
		});
	}

	getSetupPayments (instance_key) {
		console.warn("Deprecated 20200601");
		return this.apiGet(instance_key, `/setup/payments`);
	}

	createInstance(options) {
		return this.apiPost(null, '/instances', options);
	}
	
	updateInstance(instance_key, options) {
		return this.apiPut(instance_key, '', options);
	}
	
	deleteInstance(instance_key) {
		return this.apiDelete(instance_key, '');
	}
	
	getInstance(instance_key) {
		return this.apiGet(instance_key, '');
	}
	
	deeplink(options) {
		return this.apiPost(instance_key, `/deep_links`, options);
	}

	paymentButton (options) {
		return new Buffer(JSON.stringify(options)).toString("base64");
	}
 
 	paymentSignature (options) {
		return this._sign("doPayment", options);
	}

	paymentUrl (instance_key, options) {
		return this.apiPost(instance_key, `/payment_url`, options);
	}

	doPayment(instance_key, payment) {
		return this.apiPost(instance_key, `/payments`, payment);
	}

	getPayment(instance_key, payment_key, options) {
		return this.apiGet(instance_key, `/payments/${payment_key}`, options);
	}

	doRefund(instance_key, payment_key, refund) {
		return this.apiPost(instance_key, `/payments/${payment_key}/refund`, refund);
	}

	getRefund(instance_key, refund_key, options) {
		return this.apiGet(instance_key, `/refunds/${refund_key}`, options);
	}
	
	selectTokenButton (options) {
		return new Buffer(JSON.stringify(options)).toString("base64");
	}
 
	selectTokenSignature (options) {
		return this._sign("selectToken", options);
	}

	selectTokenUrl (options) {
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