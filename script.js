const transactions = [];
const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const ctx = document.getElementById('expenseChart').getContext('2d');
const balanceEl = document.getElementById('balance');

let chart;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if (!description || isNaN(amount)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const transaction = { description, amount, type };
  transactions.push(transaction);

  updateList();
  updateChart();
  updateBalance();
  form.reset();
});

function updateList() {
  list.innerHTML = '';
  transactions.forEach((t, index) => {
    const li = document.createElement('li');
    li.className = t.type;
    li.innerHTML = `
      <span>${t.description} - $${t.amount.toFixed(2)} (${t.type})</span>
      <button onclick="editTransaction(${index})">📝 Edit</button>
      <button onclick="deleteTransaction(${index})">🗑️ Delete</button>
    `;
    list.appendChild(li);
  });
}

function updateChart() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (chart) chart.destroy();

  if (income === 0 && expense === 0) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return;
  }

  let labels = [];
  let data = [];
  let backgroundColor = [];

  if (income > 0) {
    labels.push('Income');
    data.push(income);
    backgroundColor.push('#4CAF50');
  }

  if (expense > 0) {
    labels.push('Expense');
    data.push(expense);
    backgroundColor.push('#F44336');
  }

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    }
  });
}

function updateBalance() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  balanceEl.textContent = balance.toFixed(2);
}

function deleteTransaction(index) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions.splice(index, 1);
    updateList();
    updateChart();
    updateBalance();
  }
}

function editTransaction(index) {
  const transaction = transactions[index];
  const newDesc = prompt("Edit description:", transaction.description);
  const newAmount = prompt("Edit amount:", transaction.amount);
  const newType = prompt("Edit type (income/expense):", transaction.type);

  if (
    newDesc &&
    !isNaN(parseFloat(newAmount)) &&
    (newType === "income" || newType === "expense")
  ) {
    transactions[index] = {
      description: newDesc.trim(),
      amount: parseFloat(newAmount),
      type: newType
    };
    updateList();
    updateChart();
    updateBalance();
  } else {
    alert("Invalid input. Edit canceled.");
  }
}
