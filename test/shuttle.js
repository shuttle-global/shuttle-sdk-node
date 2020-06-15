var _ = require('lodash');
var fs = require('fs');
var Shuttle = require("../shuttle");


QUnit.module("shuttle", {
});

var tests = JSON.parse(fs.readFileSync("test/tests.js"));
var payments = new Shuttle(tests.options);

_.map(tests.setup, (test, i) => {
	QUnit.test("setupButton" + i, function (assert) {
		var value = payments.setupButton(_.defaults({ instance_key: test.instance_key }, test.options));
		assert.equal(value, test.button, "encoded correctly");	
	});

	QUnit.test("setupSignature" + i, function (assert) {
		var value = payments.setupSignature(_.defaults({ instance_key: test.instance_key, _timestamp: test.signature_timestamp }, test.options));
		assert.equal(value, test.signature, "encoded correctly");	
	});

	QUnit.test("setupUrl" + i, function (assert) {
		var value = payments.setupUrl(_.defaults({ instance_key: test.instance_key }, test.options));
		assert.equal(value.replace(/\/[^/]*$/, ""), test.url.replace(/\/[^/]*$/, ""), "encoded correctly");
	});

	QUnit.test("getSetup" + i, function (assert) {
		assert.expect(1);
		return payments.getSetupPayments(test.instance_key)
		.then((value) => {
			// console.log("Output: " + JSON.stringify(value));
			assert.ok(value.payments_ready, "setup payments_ready");
		});
	});
});

_.map(tests.payment, (test, i) => {
	QUnit.test("paymentButton" + i, function (assert) {
		var value = payments.paymentButton(_.defaults({ instance_key: test.instance_key }, test.options));
		assert.equal(value, test.button, "encoded correctly");	
	});

	QUnit.test("paymentSignature" + i, function (assert) {
		var value = payments.paymentSignature(_.defaults({ instance_key: test.instance_key, _timestamp: test.signature_timestamp }, test.options));
		assert.equal(value, test.signature, "encoded correctly");	
	});

	QUnit.test("paymentUrl" + i, function (assert) {
		return payments.paymentUrl(test.instance_key, { payment: test.options })
		.then((paymentUrl) => {
			assert.ok(_.startsWith((paymentUrl || {}).url, test.url), "encoded correctly");
		});
	});

	QUnit.test("doPayment" + i, function (assert) {
		assert.expect(6);
		var payment = _.defaults({}, test.doPayment_defaults, test.options);

		return payments.doPayment(test.instance_key, { payment: payment })
		.then((doPayment) => {
			console.log("Payment: " + JSON.stringify(doPayment));
			assert.ok(doPayment.payment, "object created");
			assert.equal(doPayment.payment.gateway_status, "APPROVED", "payment approved");

			return payments.getPayment(test.instance_key, doPayment.payment.id)
			.then((getPayment) => {
				console.log("getPayment: " + JSON.stringify(doPayment));
				assert.ok(doPayment.payment.id, getPayment.payment.id, "get matched post");

				return payments.doRefund(test.instance_key, doPayment.payment.id, {
					refund: {
						amount: 1
					}
				});
			}).then((doRefund) => {
				console.log("Refund: " + JSON.stringify(doRefund));
				assert.ok(doRefund.refund.id, "doRefund returned id");
				assert.equal(doRefund.refund.gateway_status, "APPROVED", "refund success");

				return payments.getRefund(test.instance_key, doRefund.refund.id)
				.then((getRefund) => {
					console.log("getRefund: " + JSON.stringify(getRefund));
					assert.equal(doRefund.refund.id, getRefund.refund.id, "getRefund returned id");
				});
			})
		});
	});
});




