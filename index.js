
let transactions = []
function renderTransaction(transaction) {
  const container = document.createElement('div')
  container.classList.add('transaction')
  container.id = `transaction-${transaction.id}`


  const title = document.createElement('span')
  title.classList.add('transaction-title')
  title.textContent = transaction.name


  const span = document.createElement('span')
  span.classList.add('transaction-amount')
  if (transaction.amount > 0) {
    span.textContent = transaction.amount
    span.classList.add('credit')
  } else {
    span.textContent = transaction.amount
    span.classList.add('debit')
  }

  const editBtn = document.createElement('button')
  editBtn.classList.add('edit-btn')
  editBtn.textContent = 'Editar'
  editBtn.addEventListener('click', () => {
    document.querySelector('#id').value = transaction.id
    document.querySelector('#name').value = transaction.name;
    document.querySelector('#amount').value = transaction.amount
  })

  const btnExcluir = document.createElement('button')
  btnExcluir.classList.add('delete-btn')
  btnExcluir.textContent = 'Excluir'
  btnExcluir.addEventListener('click', async (ev) => {
    const id = document.querySelector('#id').value = transaction.id
    const removeContent = document.querySelector('#transactions').removeChild(container)
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ removeContent })
    })
    const responeData = await response.json()
  })

  document.querySelector('#transactions').appendChild(container)
  container.append(title, span, editBtn, btnExcluir)
}

function somarSaldo() {
  const balance = document.querySelector('#balance')
  const soma = transactions.reduce((acum, n) => acum + n.amount, 0)
  balance.textContent = soma
}

//função que requisita as promise do DB e mostra todos os itens do DB na tela
async function setup() {
  const response = await fetch('http://localhost:3000/transactions').then(res => res.json())
  transactions.push(...response)
  console.table(transactions)
  for (let i = 0; i < transactions.length; i++) {
    renderTransaction(transactions[i])
  }
  somarSaldo()
}

function loadForm() {
  const form = document.querySelector('form')
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault()
    const id = document.querySelector('#id').value
    const transactionData = {
      name: document.querySelector('#name').value,
      amount: parseFloat(document.querySelector('#amount').value)
    }

    if (id) {
      const response = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      })
      const transaction = await response.json()
      const indexToRemove = transactions.findIndex((i) => i.id == id)
      transactions.splice(indexToRemove, 1, transaction)
      document.querySelector(`#transaction-${id}`).remove()
      renderTransaction(transaction)
    }

    else {
      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      })
      const saveForm = await response.json()
      transactions.push(saveForm)
    }

    form.reset()
    renderTransaction(saveForm)
  })
}

document.addEventListener('DOMContentLoaded', setup)

document.addEventListener('DOMContentLoaded', loadForm)