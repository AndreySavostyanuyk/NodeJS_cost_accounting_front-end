let allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
let valueCost= '';
let valueSpent = '';
let inputCost = null;
let inputSpent = null;
let flag = false;
let curentIndex;
let Cost;
let Score;
let sum;
const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const dateObj = new Date();
const month = monthNames[dateObj.getMonth()];
const day = String(dateObj.getDate()).padStart(2, '0');
const year = dateObj.getFullYear();
const output = month  + ' ' + day  + '.' + year;

window.onload = async function init () {
	inputCost = document.getElementById('add-expenses');
  inputSpent = document.getElementById('add-expenses2');
	inputCost.addEventListener('change', updateCost);
  inputSpent.addEventListener('change', updateSpent);

	const resp = await fetch('http:/localhost:8000/allExpenses', {
		method: 'GET'
	});
	const result = await resp.json();
	allExpenses = result.data;

	sumFunction(allExpenses);
	render();
};	

sumFunction = async (arr) => {
	let initialValue = 0;
	let sum = arr.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.Cost;
}, initialValue)
	document.getElementById('sum').textContent = `${sum} р.` ;
};

onClickButton = async () => {
	const resp = await fetch('http://localhost:8000/createExpenses', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Access-Control-Alow-Origin': '*'
		},
		body: JSON.stringify( {
			Score: valueSpent,
			Cost: valueCost,
			date: output
		})
	});
	const result = await resp.json();
	allExpenses = result.data;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));
	localStorage.setItem('sum', sum);
	valueCost= "";
  valueSpent = "";
	inputCost.value = "";
  inputSpent.value = "";

	sumFunction(allExpenses);
	render();
};

updateCost = (event) => {
	valueCost = event.target.value;
};

updateSpent = (event) => {
  valueSpent = event.target.value;
};

render = async () => {
	const content = document.getElementById('content-page');

	while(content.firstChild) {
		content.removeChild(content.firstChild);
	};
		
	allExpenses.map((item, index) => {
		const container = document.createElement('div');
		container.id = `expenses-${index}`;
		container.className = 'expenses-container';
		
		const box = document.createElement('div');
		box.className = 'expenses-box';
		container.appendChild(box);

		const boxPrice = document.createElement('div');
		boxPrice.className = 'expenses-boxPrice';
		container.appendChild(boxPrice);

		const numbering = document.createElement('p');
		numbering.textContent = `${index + 1} )`;
		
		numbering.onchange = function () {
			onChangeNumbering(index);
		}
		box.appendChild(numbering);

		if (index === curentIndex) {
			const inputTextScore = document.createElement('input');
			inputTextScore.type = 'textCost';
			inputTextScore.value = item.Score;
			inputTextScore.id = 'inputId2';
			container.appendChild(inputTextScore);
			
			const inputTextCost = document.createElement('input');
			inputTextCost.type = 'number';
			inputTextCost.value = item.Cost;
			inputTextCost.id = 'inputId';
			container.appendChild(inputTextCost);

			const boxImg = document.createElement('div');
			boxImg.className = 'expenses-boxImg';
			container.appendChild(boxImg);
			
			const imageClear = document.createElement('img'); 
			imageClear.src = 'images/clear.svg';
			boxImg.appendChild(imageClear);

			imageClear.onclick = function () {
				EditClear(index);
			};

			const imageOk = document.createElement('img');
			imageOk.src = 'images/ok.svg';
			boxImg.appendChild(imageOk);
			imageOk.onclick = function () {
				EditOk(index);
			};
		} else {
			const textScore = document.createElement('p');
			const textCost = document.createElement('p');
			const dateText = document.createElement('p')
			
			const boxImg = document.createElement('div');
			boxImg.className = 'expenses-boxImg';
			container.appendChild(boxImg);

			const imageEdit = document.createElement('img');
			imageEdit.src = 'images/edit.svg';
			boxImg.appendChild(imageEdit);

			imageEdit.onclick = function () {
				EditItem(index);
			};

			const imageDelete = document.createElement('img');
			imageDelete.src = 'images/delete.svg';
			boxImg.appendChild(imageDelete);
		
			imageDelete.onclick = function () {
				DeleteItem(index,container);
			};
			dateText.textContent = item.date;
			textScore.innerText = `Магазин "${item.Score}"`;
			textCost.innerText = item.Cost + ' р.';
			textCost.className = item.isCheck ? 'textCost-expenses done-textCost' : 'textCost-expenses';
			box.appendChild(textScore);
			box.appendChild(dateText);
			boxPrice.appendChild(textCost);
		};	
		content.appendChild(container);
	});
};

onChangeNumbering = (index) => {
	allExpenses[index].isCheck = !allExpenses[index].isCheck;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	render();
};

EditOk = async (index) => {
	inputCost = document.getElementById('inputId');
	inputCost.addEventListener('change', updateCost);

	inputSpent = document.getElementById('inputId2');
	inputSpent.addEventListener('change', updateSpent);

	const resp = await fetch('http://localhost:8000/editExpenses', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Access-Control-Alow-Origin': '*'
		},
		body: JSON.stringify( {
			_id: allExpenses[index]._id,
			Cost: inputCost.value,
			Score: inputSpent.value,
		})
	});
	const result = await resp.json();
	allExpenses = result.data;
	curentIndex = null;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	sumFunction(allExpenses);
	render();
};

EditClear = (index) => {
	curentIndex = null;

	render();
};

EditItem = (index, item, container) => {
	curentIndex = index;

	render();
};

DeleteItem = async (index, item) => {
	const resp = await fetch(`http://localhost:8000/deleteExpenses?_id=${allExpenses[index]._id}`, {
		method: 'DELETE'
	});
	const result = await resp.json();
	allExpenses = result.data;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	sumFunction(allExpenses)
	render();
};

DeleteAll = async () => {
	const resp = await fetch('http://localhost:8000/deleteAllExpenses', {
		method: 'DELETE'
	});
	const result = await resp.json();
	allExpenses = result.data;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	render();
};