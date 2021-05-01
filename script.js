import Select from './select.js'

document.querySelectorAll('[data-custom]').forEach(el => {
	new Select(el, 200)
})

document.getElementById('form').addEventListener('submit', e => {
	e.preventDefault()
	for (let el of e.target.elements) {
		console.log(el.value)
	}
})
