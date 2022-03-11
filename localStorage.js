export default {
    getLocalStorage() {
        return localStorage.getItem('list') ? 
        JSON.parse(localStorage.getItem('list')) : []
    },
    addLocalStorage(id, content) {
        const list = this.getLocalStorage()
        list.push({ id, content, status: 'active' })
        localStorage.setItem('list', JSON.stringify(list))
    },
    deleteLocalStorage(id) {
        const list = this.getLocalStorage()
        const newList = []
        list.forEach(item => {
            if (item.id == id) return
            newList.push(item)
        })
        localStorage.setItem('list', JSON.stringify(newList))
    },
    updateLocalStorage(id, status) {
        const list = this.getLocalStorage()
        list.forEach(item => {
            if (item.id == id)
                item.status = status
        })
        localStorage.setItem('list', JSON.stringify(list))
    },
    render(container) {
        const list = this.getLocalStorage()
        container.innerHTML = list.map(item => {
            return `
            <article id="${item.id}" class="todo-item ${item.status}">
                <div class="todo-item-checked">
                    <i class="fa-solid fa-check"></i>
                </div>
                <p class="todo-item-content">${item.content}</p>
                <button class="todo-item-remove">
                    <i class="fa-solid fa-xmark todo-item-remove-icon"></i>
                </button>
            </article>
            `
        }).join('')
    }
}