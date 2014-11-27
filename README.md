# TSConfig

Truly simple config UI (or not)

This code shows auto-generated UI for your user scripts. It does not actually read or store anything.

## How to use

```
var t = new TSConfig();
t.on('save', write_results);
t.on('cancel', config_cancelled);
t.show(config_data);
```

## Methods

### on(event_name, your_function_handler)

Will bind your function to a given event. There are only two available: 'save' and 'cancel'.

You cannot bind more than one event, though. Only the last one will execute.

#### save
```
function (changed_values)
{
}
```

changed_values is an array (of possibly zero length) of *changed* configuration items (hashes). Basically, it is:

```
[{section: 'AAA', name: 'BBB', value: 'CCC'}, {section: 'AAA', name: 'XXX', value: 'YYY'}...]
```

#### cancel
```
function ()
{
}
```

### show(config_data, save_button_text, cancel_button_text)

Shows generated UI. config_data is a an array of sections (hashes).

* save_button_text - Save button text. Optional.
* cancel_button_text - Cancel button text. Optional.

```
var item = {
	section: SECTION,
	data: [
		{ name: SOMENAME, type: TYPE, label: SOMELABEL, value: VALUE, title: TOOLTIP, OTHER_OPTIONS },
		{ name: SOMENAME, type: TYPE, label: SOMELABEL, value: VALUE, title: TOOLTIP, OTHER_OPTIONS },
		…
	]
}
...
var config_data = [item, item2, item3...];
```

where

* SECTION - configuration section name (say, 'General'). Write whatever you like here, although section names should be unique.
* SOMENAME - option name as used by your code (say 'title' or 'something.title'). Write whatever you like here, although section names should be unique.
* TYPE - option type. There are 5 types: 'line', 'text', 'number', 'check', and 'list'. See next section for details.
* SOMELABEL - option label as seen by user.
* VALUE - option's default value. Varies. See next section. Optional.
* TOOLTIP - option's tooltip that appears on hover (optional).
* OTHER_OPTIONS - some types have other options, see below.

#### Types

##### line

Single line of text (input type="text"). VALUE (for config_data) should be a string.

Other options include:

* maxlength - maximum length. Might not work if your browser does not support it (will be ignored in such a case).

Return value: string.

##### text

Multi-line text (textarea). See 'line'.

##### number

A number (input type="number"). Might be shown as line if your browser does not support it. VALUE (for config_data) should be a number or string (not necessary an integer).

* min - minimum value.
* max - maximum value.
* step - step (browser's default is usually 1).

Return value: string. It might not have any numbers in it, you must check it yourself.

##### check

Checkbox (input type="checkbox"). VALUE should be true or false (code just checks whether it is truthy).

Return value: true or false.

##### list

Combo box (select). VALUE should be an array of strings. You can specify a simple string, but…

Other options include:

* selected - 0-based index of the selected item.

Return value: 0-based index of the selected item. Uses select.selectedIndex.

### hide()

Will hide configuration UI. 'cancel' event will also execute.

## Limitations

* No radio buttons. There is a list, it should be enough for everybody *\*cough\**
* All styles are inline, in the JS code itself because this is supposed to be used with user scripts. It looks a bit messy as a result. Maybe one day scoped styles and reset CSS property will work…
* Ok, well, the code itself could also be a bit better as extending it with other types looks somewhat unpleasant.
* Floats. Each option is floated to the left (50% width). Just group your options carefully (say, place TEXTs at the bottom of your sections). You will see what I'm talking about :}
