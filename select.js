export default class Select {
	constructor(el, w = 0) {
		this.element = el
		this.elementWitdh = w || 0
		this.options = getFormattedOptions(el.querySelectorAll('option'))
		this.customElement = document.createElement('div')
		this.labelElement = document.createElement('span')
		this.optionsCustomElement = document.createElement('ul')
		setupCustomElem(this)
		el.style.display = 'none'
		el.after(this.customElement)
	}

	get selectedOption() {
		return this.options.find(option => option.selected)
	}

	get selectedOptionIndex() {
		return this.options.indexOf(this.selectedOption)
	}

	selectValue(value) {
		const newSelectionOption = this.options.find(op => op.value === value)
		const prevSelectionOption = this.selectedOption
		prevSelectionOption.selected = false
		prevSelectionOption.element.selected = false

		newSelectionOption.selected = true
		newSelectionOption.element.selected = true

		this.labelElement.innerText = newSelectionOption.label
		this.optionsCustomElement.querySelector(`[data-value="${prevSelectionOption.value}"]`).classList.remove('selected')

		const newCustEl = this.optionsCustomElement.querySelector(`[data-value="${newSelectionOption.value}"]`)
		newCustEl.classList.add('selected')
		newCustEl.scrollIntoView({ block: 'nearest' })
		this.element.dispatchEvent(new Event('change'))
	}
}

function setupCustomElem(select) {
	select.customElement.classList.add('custom-select-container')
	select.customElement.tabIndex = -1

	if (select.elementWitdh > 0) {
		select.customElement.style.width = `${select.elementWitdh}px`
	}
	select.labelElement.classList.add('custom-select-value')
	select.labelElement.innerText = select.selectedOption.label
	select.customElement.append(select.labelElement)

	select.optionsCustomElement.classList.add('custom-select-options')
	select.options.forEach(option => {
		const optionElement = document.createElement('li')
		optionElement.classList.add('custom-select-option')
		optionElement.classList.toggle('selected', option.selected)
		optionElement.innerText = option.label
		optionElement.dataset.value = option.value
		optionElement.addEventListener('click', () => {
			select.selectValue(option.value)
			select.optionsCustomElement.classList.remove('show')
			select.labelElement.classList.remove('open')
		})
		select.optionsCustomElement.append(optionElement)
	})
	select.customElement.append(select.optionsCustomElement)

	select.labelElement.addEventListener('click', () => {
		select.optionsCustomElement.classList.toggle('show')
		select.labelElement.classList.toggle('open')
		select.optionsCustomElement.querySelector('.selected').scrollIntoView({ behavior: 'smooth', block: 'nearest' })
	})

	select.customElement.addEventListener('blur', () => {
		select.optionsCustomElement.classList.remove('show')
		select.labelElement.classList.remove('open')
	})

	let debTimeout
	let searchTerm = ''
	select.customElement.addEventListener('keydown', e => {
		switch (e.code) {
			case 'Space':
				select.optionsCustomElement.classList.toggle('show')
				break
			case 'ArrowUp': {
				const pOpt = select.options[select.selectedOptionIndex - 1]
				if (pOpt) select.selectValue(pOpt.value)
				break
			}
			case 'ArrowDown': {
				const nOpt = select.options[select.selectedOptionIndex + 1]
				if (nOpt) select.selectValue(nOpt.value)
				break
			}
			case 'Enter':
			case 'Escape':
				select.optionsCustomElement.classList.remove('show')
				break
			default: {
				clearTimeout(debTimeout)
				searchTerm += e.key
				debTimeout = setTimeout(() => {
					searchTerm = ''
				}, 500)
				const searchOpt = select.options.find(op => op.label.toLowerCase().startsWith(searchTerm))
				if (searchOpt) select.selectValue(searchOpt.value)
				break
			}
		}
	})
}

function getFormattedOptions(optionElements) {
	return [...optionElements].map(optionElement => {
		return {
			value: optionElement.value,
			label: optionElement.label,
			selected: optionElement.selected,
			element: optionElement
		}
	})
}
