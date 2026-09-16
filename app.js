// app.js

// Пытаемся достать данные из LocalStorage. Если там пусто, создаем пустой массив
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let habitCounter = parseInt(localStorage.getItem('habitCounter')) || 0;

// Функция для подсчета общего баланса
function updateBalance() {
    let total = 0;
    
    // Обычный цикл for, чтобы было понятно и читаемо
    for (let i = 0; i < transactions.length; i++) {
        total += transactions[i].amount;
    }
    
    document.getElementById('balance-display').innerText = total + " ₽";
}

// Отрисовка списка истории на странице
function renderHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Очищаем список перед новым рендером
    
    transactions.forEach(function(item, index) {
        const li = document.createElement('li');
        
        // Если сумма больше нуля - это доход (зеленый), если меньше - расход (красный)
        li.className = item.amount > 0 ? "income bg-slate-700 p-3 rounded-lg flex justify-between items-center" : "expense bg-slate-700 p-3 rounded-lg flex justify-between items-center";
        
        li.innerHTML = `
            <span class="font-medium">${item.text}</span> 
            <span class="font-bold">${item.amount} ₽</span>
            <button onclick="deleteItem(${index})" class="text-slate-400 hover:text-red-400 ml-2">❌</button>
        `;
        
        historyList.appendChild(li);
    });
    
    // После отрисовки обновляем цифру баланса
    updateBalance();
}

// Обработчик формы добавления
function addTransaction(e) {
    e.preventDefault(); // Отменяем перезагрузку страницы при отправке формы
    
    const textInput = document.getElementById('trans-text').value;
    const amountInput = document.getElementById('trans-amount').value;
    
    // Простая проверка, чтобы не отправляли пустые поля
    if (textInput.trim() === '' || amountInput.trim() === '') {
        alert('Пожалуйста, введи название и сумму!');
        return;
    }
    
    const newTrans = {
        text: textInput,
        amount: parseInt(amountInput)
    };
    
    transactions.push(newTrans);
    
    // Сохраняем в LocalStorage, чтобы данные не пропали при закрытии вкладки
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Очищаем инпуты
    document.getElementById('trans-text').value = '';
    document.getElementById('trans-amount').value = '';
    
    renderHistory();
}

// Удаление элемента из массива
function deleteItem(index) {
    // Вырезаем 1 элемент по его индексу
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderHistory();
}

// Кнопка привычки
function incrementHabit() {
    habitCounter += 1;
    localStorage.setItem('habitCounter', habitCounter);
    document.getElementById('habit-count').innerText = habitCounter;
}

// Когда страница загрузилась — запускаем рендер того, что было сохранено
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('habit-count').innerText = habitCounter;
    renderHistory();
    
    const form = document.getElementById('trans-form');
    if (form) {
        form.addEventListener('submit', addTransaction);
    }
});
