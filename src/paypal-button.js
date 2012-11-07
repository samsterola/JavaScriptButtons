if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {

	'use strict';


	var app = {},
		prettyParams = {
			id: 'hosted_button_id',
			name: 'item_name',
			number: 'item_number'

		},
		buttonUrls = {
			buynow: '//www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif',
			cart: '//www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif',
			basic: '//www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif'
		};


	if (!PAYPAL.apps.ButtonFactory) {
		/**
		 * A count of each type of button on the page
		 */
		app.buttons = {
			buy: 0,
			cart: 0,
			api: 0
		};

		/**
		 * Renders a button in place of the given element
		 *
		 * @param parent {HTMLElement} The element to add the button to
		 * @param type (String) The type of the button to render
		 * @param data {Object} An object of key/value data to set as button params
		 * @return {Boolean}
		 */
		app.create = function (parent, type, data) {
			var form = document.createElement('form'),
				btn = document.createElement('input'),
				hidden = document.createElement('input'),
				input, key;

			// Don't render without the merchant ID
			if (!data.business) {
				return false;
			}

			btn.type = 'image';
			hidden.type = 'hidden';
			form.method = 'post';
			form.action = "https://www.paypal.com/cgi-bin/webscr";
			form.appendChild(btn);

			// Cart buttons
			if (type === 'cart') {
				data.cmd = '_cart';
				data.add = true;
			// Hosted buttons
			} else if (data.hosted_button_id) {
				data.cmd = '_s-xclick';
			// Plain text buttons
			} else {
				data.cmd = '_xclick';
			}

			btn.src = getButtonUrl(type);

			for (key in data) {
				input = hidden.cloneNode(true);
				input.name = prettyParams[key] || key;
				input.value = data[key];

				form.appendChild(input);
			}

			parent.appendChild(form);

			// Register it
			this.buttons[type] += 1;

			// If the Mini Cart is present then register the button
			if (type === 'cart' && PAYPAL.apps.MiniCart) {
				var MiniCart = PAYPAL.apps.MiniCart;

				if (!MiniCart.UI.itemList) {
					MiniCart.render();
				} else {
					MiniCart.bindForm(form);
				}
			}

			return true;
		};

		// Export the app
		PAYPAL.apps.ButtonFactory = app;
	}


	/**
	 * Utility function to return the rendered button image URL
	 *
	 * @param type {String} The type of button to render
	 * @return {String}
	 */
	function getButtonUrl(type) {
		return buttonUrls[type] || buttonUrls.basic;
	}


	/**
	 * Utility function to polyfill dataset functionality for browsers
	 *
	 * @param el {HTMLElement} The element to check
	 * @return {Object}
	 */
	function getDataSet(el) {
		var dataset = el.dataset,
			attrs, attr, matches, len, i;

		if (!dataset) {
			dataset = {};

			if ((attrs = el.attributes)) {
				for (i = 0, len = attrs.length; i < len; i++) {
					attr = attrs[i];

					if ((matches = /^data-(.+)/.exec(attr.name))) {
						dataset[matches[1]] = attr.value;
					}
				}
			}
		}

		return dataset;
	}


	// Init the buttons
	var ButtonFactory = PAYPAL.apps.ButtonFactory,
		nodes = document.getElementsByTagName('script'),
		node, data, button, business, i, len;

	for (i = 0, len = nodes.length; i < len; i++) {
		node = nodes[i];
		data = node && getDataSet(node);
		button = data && data.button;
		business = data.business = node.src.split('?merchant=')[1];

		if (button && business) {
			ButtonFactory.create(node.parentNode, button, data);

			// Clean up
			node.parentNode.removeChild(node);
		}
	}


}());