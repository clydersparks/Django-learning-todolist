const input = document.querySelector('form input')
const button = document.querySelector('.submit')
const todosContainer = document.querySelector('.todo-container')

const STORAGE_KEY = 'todos'

// ---- Load & normalize (migration) ----
function loadTodos() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  // Convert legacy strings to objects, sanitize, and ensure done is boolean
  return raw
    .filter(Boolean) // remove null/undefined
    .map(item => {
      if (typeof item === 'string') {
        return { text: item, done: false }
      }
      // if it's already an object, normalize fields
      return {
        text: (item && item.text != null) ? String(item.text) : '',
        done: Boolean(item && item.done)
      }
    })
    .filter(t => t.text.trim() !== '') // drop empties
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

let todosArray = loadTodos()

function renderTodos() {
  // Build once; use data-index for delegation
  const html = todosArray.map((todo, index) => `
    <div class="todo-div" data-index="${index}">
      <h2 style="text-decoration:${todo.done ? 'line-through' : 'none'};">
        ${todo.text}
      </h2>
      <h3><i class="fa-solid fa-check-double done" title="Mark done/undo"></i></h3>
    </div>
  `).join('')
  todosContainer.innerHTML = html
}

// Initial normalize + save back (so storage is clean) + render
saveTodos(todosArray)
renderTodos()

button.addEventListener('click', (e) => {
  e.preventDefault()

  const value = input.value.trim()
  if (value === '') {
    input.classList.add('clicked')
    return
  }

  todosArray.push({ text: value, done: false })
  saveTodos(todosArray)

  input.value = ''
  input.classList.remove('clicked')
  renderTodos()
})

button.addEventListener('dblclick', () => {
    localStorage.clear()
})

// Single delegated listener (no duplicates)
todosContainer.addEventListener('click', (e) => {
  const doneIcon = e.target.closest('.done')
  if (!doneIcon) return

  const wrapper = doneIcon.closest('.todo-div')
  const index = Number(wrapper?.dataset?.index)
  if (Number.isNaN(index)) return

  todosArray[index].done = !todosArray[index].done
  saveTodos(todosArray)
  renderTodos()
})

