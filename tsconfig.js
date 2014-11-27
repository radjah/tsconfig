'use strict';
function TSConfig()
{
	// backdrop
	this._container = document.createElement('div');
	this._container.setAttribute('style', 'position: fixed;z-index: 10;left: 0;top: 0;width: 100%;height: 100%;display: none;background: #FFF;color: #000;box-sizing: border-box;border: 8px solid rgba(0,0,0,.7);padding: 0 8px;overflow: auto;line-height: 1.2;');
	document.body.appendChild(this._container);
	// valid events
	this._valid_events = ['save', 'cancel'];
	this._event_handlers = {};
}
TSConfig.prototype.show = function(config_data, save_button_text, cancel_button_text) {
	this._container.textContent = '';
	var generators = {
		'line': this._generate_line,
		'text': this._generate_text,
		'number': this._generate_number,
		'check': this._generate_check,
		'list': this._generate_list
	};
	// generating inputs
	for (var i = 0, len = config_data.length; i < len; ++i) {
		var item = config_data[i];
		this._start_section(item.section);
		var current_data = item.data;
		for (var j = 0, len2 = current_data.length; j < len2; ++j) {
			var current_data_item = current_data[j];
			if (current_data_item.type in generators) {
				generators[current_data_item.type].call(this, item.section, current_data_item);
			}
		}
	}
	// save/cancel buttons
	this._make_save_cancel_buttons(save_button_text || 'Save', cancel_button_text || 'Cancel');
	// show
	this._container.style.display = 'block';
}
TSConfig.prototype.hide = function() {
	this._container.style.display = 'none';
	if (this._event_handlers.cancel) {
		this._event_handlers.cancel();
	}
}
TSConfig.prototype.on = function(event, func) {
	if ((this._valid_events.indexOf(event) !== -1) && (typeof func === 'function')) {
		this._event_handlers[event] = func;
	}
}
TSConfig.prototype._generate_line = function(section, data) {
	var wrap = this._make_wrapper();
	var input = this._make_generic_input('text');
	var label = document.createElement('label');
	this._pass_attr(data, input, 'value');
	this._pass_attr(data, input, 'maxlength');
	this._pass_attr(data, input, 'title');
	input.setAttribute('data-name', data.name);
	input.setAttribute('data-section', section);
	input.setAttribute('data-initial-value', input.value);
	label.textContent = data.label;
	label.appendChild(input);
	wrap.appendChild(label);
	this._container.appendChild(wrap);
}
TSConfig.prototype._generate_text = function(section, data) {
	var wrap = this._make_wrapper();
	var input = document.createElement('textarea');
	input.setAttribute('style', 'box-sizing: border-box;border: 1px solid #AAA;width: 100%;padding: .2em .5ex;background: #FFF;color: #000;height: 4em;');
	var label = document.createElement('label');
	this._pass_attr(data, input, 'maxlength');
	this._pass_attr(data, input, 'title');
	if (data.value) {
		input.value = data.value;
	}
	input.setAttribute('data-name', data.name);
	input.setAttribute('data-section', section);
	input.setAttribute('data-initial-value', input.value);
	label.textContent = data.label;
	label.appendChild(input);
	wrap.appendChild(label);
	this._container.appendChild(wrap);
}
TSConfig.prototype._generate_number = function(section, data) {
	var wrap = this._make_wrapper();
	var input = this._make_generic_input('number');
	var label = document.createElement('label');
	this._pass_attr(data, input, 'value');
	this._pass_attr(data, input, 'maxlength');
	this._pass_attr(data, input, 'title');
	this._pass_attr(data, input, 'min');
	this._pass_attr(data, input, 'max');
	this._pass_attr(data, input, 'step');
	input.setAttribute('data-name', data.name);
	input.setAttribute('data-section', section);
	input.setAttribute('data-initial-value', input.value);
	label.textContent = data.label;
	label.appendChild(input);
	wrap.appendChild(label);
	this._container.appendChild(wrap);
}
TSConfig.prototype._generate_check = function(section, data) {
	var wrap = this._make_wrapper();
	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	this._pass_attr(data, input, 'title');
	input.setAttribute('data-name', data.name);
	input.setAttribute('data-section', section);
	if (data.value) {
		input.checked = true;
	}
	input.setAttribute('data-initial-value', input.checked);
	var label = document.createElement('label');
	label.appendChild(input);
	label.appendChild(document.createTextNode(' ' + data.label));
	wrap.appendChild(label);
	this._container.appendChild(wrap);
}
TSConfig.prototype._generate_list = function(section, data) {
	if (!data.value) return;
	var wrap = this._make_wrapper();
	var input = document.createElement('select');
	this._pass_attr(data, input, 'title');
	input.setAttribute('style', 'box-sizing: border-box;border: 1px solid #AAA;width: 100%;padding: .2em .5ex;background: #FFF;color: #000;');
	input.setAttribute('data-name', data.name);
	input.setAttribute('data-section', section);
	var real_data = data.value.length ? data.value : [data.value];
	for (var i = 0, len = real_data.length; i < len; ++i) {
		var option = document.createElement('option');
		option.textContent = real_data[i];
		input.appendChild(option);
	}
	if ('selected' in data) {
		input.selectedIndex = data.selected;
	}
	input.setAttribute('data-initial-value', input.selectedIndex);
	var label = document.createElement('label');
	label.textContent = data.label;
	label.appendChild(input);
	wrap.appendChild(label);
	this._container.appendChild(wrap);
}
TSConfig.prototype._start_section = function(title) {
	if (title) {
		var heading = document.createElement('div');
		heading.textContent = title;
		heading.setAttribute('style', 'margin-bottom: .5em;padding: 1em 0 .5em 0; border-bottom: 1px solid #DDD;font-weight: bold;clear: left;');
		this._container.appendChild(heading);
	}
}
TSConfig.prototype._make_wrapper = function() {
	var result = document.createElement('div');
	result.setAttribute('style', 'margin-top: .5em;float: left;box-sizing: border-box;width: 50%;padding: 0 4px;');
	return result;
}
TSConfig.prototype._make_generic_input = function(type) {
	var result = document.createElement('input');
	result.setAttribute('type', type);
	result.setAttribute('style', 'box-sizing: border-box;border: 1px solid #AAA;width: 100%;padding: .2em .5ex;background: #FFF;color: #000;');
	return result;
}
TSConfig.prototype._pass_attr = function(data, element, attr_name) {
	if (attr_name in data) {
		 element.setAttribute(attr_name, data[attr_name]);
	}
}
TSConfig.prototype._make_save_cancel_buttons = function(save_button_text, cancel_button_text) {
	var w = document.createElement('div');
	w.setAttribute('style', 'padding: .5em 0;clear: left;');
	var button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.setAttribute('style', 'padding: .2em 1ex;');
	button.textContent = save_button_text;
	button.addEventListener(
		'click',
		(function(){
			var result = [];
			var data_elements = this._container.querySelectorAll('input, textarea, select');
			for (var i = 0, len = data_elements.length; i < len; ++i) {
				var current_element = data_elements[i];
				var current_value;
				var is_changed = false;
				switch (current_element.nodeName) {
					case 'INPUT':
						switch (current_element.getAttribute('type')) {
							case 'text':
							case 'number':
								current_value = current_element.value;
								is_changed = (current_value !== current_element.getAttribute('data-initial-value'));
								break;
							case 'checkbox':
								current_value = current_element.checked;
								var current_value_str = current_value ? 'true' : 'false';
								is_changed = (current_value_str !== current_element.getAttribute('data-initial-value'));
								break;
						}
						break;
					case 'TEXTAREA':
						current_value = current_element.value;
						is_changed = (current_value !== current_element.getAttribute('data-initial-value'));
						break;
					case 'SELECT':
						current_value = current_element.selectedIndex;
						var current_value_str = current_value.toString();
						is_changed = (current_value_str !== current_element.getAttribute('data-initial-value'));
						break;
				}
				if (is_changed) {
					result.push({
						section: current_element.getAttribute('data-section'),
						name: current_element.getAttribute('data-name'),
						value: current_value
					});
				}
			}
			this._container.style.display = 'none';
			if (this._event_handlers.save) {
				this._event_handlers.save(result);
			}
		}).bind(this),
		false
	);
	w.appendChild(button);
	button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.setAttribute('style', 'padding: .2em 1ex;margin-left: 1ex;');
	button.textContent = cancel_button_text;
	button.addEventListener(
		'click',
		(function(){
			this.hide();
		}).bind(this),
		false
	);
	w.appendChild(button);
	this._container.appendChild(w);
}
