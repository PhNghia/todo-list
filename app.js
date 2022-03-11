import localStorage from "./localStorage.js"

export default class App {
    constructor (form) {
        this.form = form
        this.inputElement = form.querySelector('.todo-heading input')
        this.addButton = form.querySelector('.todo-add-button')
        this.todoListElement = form.querySelector('.todo-list')
        this.resumeELement = form.querySelector('.todo-resume')
        // status item include "all", "active" and "completed"
        this.statusItem = 'all'
        setUpFormTodo(this)
    }

    addItem (content) {
        const article = document.createElement('article')
        const id = new Date().getTime().toString()
        article.setAttribute('class', 'todo-item active')
        // hanlder local storage with id
        article.setAttribute('id', id)
        article.innerHTML = `
            <div class="todo-item-checked">
                <i class="fa-solid fa-check"></i>
            </div>
            <p class="todo-item-content">${content}</p>
            <button class="todo-item-remove">
                <i class="fa-solid fa-xmark todo-item-remove-icon"></i>
            </button>
        `
        this.todoListElement.append(article)
        localStorage.addLocalStorage(article.id, content)
        if (this.statusItem != 'all') {
            this.statusItem == 'completed' ? alert('Add work success') : undefined
            this.renderItems()
            this.updateTotalNumberTodoItems()
        }
    }

    deleteItem (removeElement) {
        const parent = this.getParentElement(removeElement)
        if (parent.matches('.completed')) {
            parent.remove()
            localStorage.deleteLocalStorage(parent.id)
            return
        }
        const isDelete = confirm('Ố mài góttt kitchen!!! This work isn\'t completed! Are you sure delete?')
        if (isDelete) {
            parent.remove()
            localStorage.deleteLocalStorage(parent.id)
        }
    }

    deleteItemsCompleted () {
        this.todoItemsCompleted.forEach(item => {
            item.remove()
            localStorage.deleteLocalStorage(item.id)
        })
    }

    checkCompletedItem (checkElement) {
        const parent = this.getParentElement(checkElement)
        parent.classList.add('completed')
        parent.classList.remove('active')
        localStorage.updateLocalStorage(parent.id, 'completed')
    }

    displayTodoResume () {
        const todoItems = this.todoItems
        if (todoItems.length == 0) {
            this.resumeELement.classList.add('no-item')
            return
        }
        this.resumeELement.classList.remove('no-item')
    }

    updateTotalNumberTodoItems () {
        const countTotalItemElement = this.resumeELement.querySelector('.todo-total-item > span')
        let sumItems
        switch (this.statusItem) {
            case 'completed':
                sumItems = this.todoItemsCompleted.length
                break
            case 'active':
                sumItems = this.todoItemsActive.length
                break
            case 'all': 
                sumItems = this.todoItems.length
                break
        }
        countTotalItemElement.innerText = sumItems.toString()
    }

    getParentElement (element) {
        while (element.parentElement) {
            if (element.parentElement.matches('article')) 
                return element.parentElement
            element = element.parentElement
        }
    }

    renderItems () {
        switch (this.statusItem) {
            case 'completed':
                this.todoItems.forEach(item => {
                    if (this.todoItemsCompleted.includes(item)) {
                        item.style.display = 'flex'
                        return
                    }
                    item.style.display = 'none'
                })
                break
            case 'active':
                this.todoItems.forEach(item => {
                    if (this.todoItemsActive.includes(item)) {
                        item.style.display = 'flex'
                        return
                    }
                    item.style.display = 'none'
                })
                break
            case 'all': 
                this.todoItems.forEach(item => {
                    item.style.display = 'flex'
                })
                break
        }
    }

    get inputValue () {
        return this.inputElement.value
    }
    
    get todoItems () {
        return [...this.todoListElement.querySelectorAll('article.todo-item')]
    }

    get todoItemsCompleted () {
        return this.todoItems.filter(item => item.matches('article.todo-item.completed'))
    }
    
    get todoItemsActive () {
        return this.todoItems.filter(item => item.matches('article.todo-item.active'))
    }

    cleanInput () {
        this.inputElement.value = ''
        this.inputElement.focus()
    }
}

function setUpFormTodo (form) {
    localStorage.render(form.todoListElement)
    form.displayTodoResume()
    // update item
    form.updateTotalNumberTodoItems()
    // create content
    createTodoItem(form)
    // remove content
    removeTodoItem(form)
    // checked complete
    checkCompletedTodoItem(form)
    // categories
    renderItemsByStatus(form)
}

function createTodoItem (form) {
    form.addButton.addEventListener('click', (e) => {
        const value = form.inputValue
        if (value.trim() == '') {
            form.cleanInput()
            return
        }
        form.addItem(value)
        form.cleanInput()
        form.displayTodoResume()
        form.updateTotalNumberTodoItems()
    })
    form.inputElement.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            case 13: // enter
                form.addButton.click()
                break
        }
    })
}

function removeTodoItem (form) {
    form.todoListElement.addEventListener('click', (e) => {
        if (e.target.matches('.todo-item-remove-icon')) {
            form.deleteItem(e.target)
            form.displayTodoResume()
            form.updateTotalNumberTodoItems()
        }
    })
}

function checkCompletedTodoItem (form) {
    form.todoListElement.addEventListener('click', (e) => {
        if (
            e.target.matches('.todo-item-checked') ||
            e.target.parentElement.matches('.todo-item-checked') 
        ) {
            form.checkCompletedItem(e.target)
        }
    })
}

function renderItemsByStatus (form) {
    form.resumeELement.addEventListener('click', (e) => {
        if (e.target.matches('.todo-category li')) {
            form.statusItem = e.target.innerText.toLowerCase()
            form.renderItems()
            form.updateTotalNumberTodoItems()
        }
        if (e.target.matches('.todo-clear-completed')) {
            form.deleteItemsCompleted()
            form.updateTotalNumberTodoItems()
            form.displayTodoResume()
        }
    })
}