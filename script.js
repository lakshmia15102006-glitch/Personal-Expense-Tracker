const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const transaction = {
        id: Date.now(),
        title: document.getElementById("title").value.trim(),
        type: document.getElementById("type").value,
        amount: Number(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    if (!transaction.title || transaction.amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    transactions.push(transaction);
    saveTransactions();
    form.reset();

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    displayTransactions();
});

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function displayTransactions() {
    transactionList.innerHTML = "";

    let income = 0;
    let expenses = 0;

    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }

        const row = document.createElement("tr");

        const values = [
            transaction.title,
            transaction.type === "income" ? "Income" : "Expense",
            transaction.category,
            (transaction.type === "income" ? "+" : "-") +
                " ₹" + transaction.amount.toFixed(2),
            transaction.date
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            if (confirm("Delete this transaction?")) {
                transactions = transactions.filter(
                    item => item.id !== transaction.id
                );

                saveTransactions();
                displayTransactions();
            }
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        transactionList.appendChild(row);
    });

    document.getElementById("totalIncome").textContent =
        "₹" + income.toFixed(2);

    document.getElementById("totalExpense").textContent =
        "₹" + expenses.toFixed(2);

    document.getElementById("balance").textContent =
        "₹" + (income - expenses).toFixed(2);
}

displayTransactions();