import App from './app.js'

const forms = document.querySelectorAll('.todo-form')

forms.forEach(form => {
    new App(form)
})

