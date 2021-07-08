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

	sumFunction();
	render();
};	

sumFunction = async () => {
	testFunction = (arr) => {
    let sum = 0 ;
    arr.forEach(element => {
      let {_id, Cost, Score} = element;
      sum += Number(Cost);
    });
    return sum;
  };
	document.getElementById('sum').textContent = testFunction(allExpenses) + " р." ;
}

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

	sumFunction();
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
		numbering.textContent = index + 1 + ")";
		
		numbering.onchange = function () {
			onChangeNumbering(index);
		}
		box.appendChild(numbering);

		if (index === curentIndex) {
			const textScore = document.createElement('input');
			textScore.type = 'text';
			textScore.value = item.Score;
			textScore.id = 'inputId2';
			container.appendChild(textScore);
			
			const textCost = document.createElement('input');
			textCost.type = 'number';
			textCost.value = item.Cost;
			textCost.id = 'inputId';
			container.appendChild(textCost);

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
			const text2 = document.createElement('p');
			const text = document.createElement('p');
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
			text2.innerText = "Магазин " + `"${item.Score}"`;
			text.innerText = item.Cost + ' р.';
			text.className = item.isCheck ? 'text-expenses done-text' : 'text-expenses';
			box.appendChild(text2);
			box.appendChild(dateText);
			boxPrice.appendChild(text);
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

	sumFunction();
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

	sumFunction()
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