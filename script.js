let allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
let valueCost= '';
let valueSpent = '';
let inputCost = null;
let inputSpent = null;
let flag = false;
let curentIndex;
let specificIndex;
let specificIndex2;
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

const sumFunction = async (arr) => {
	const sum = arr.reduce((acc,el) => acc + el.Cost, 0);
	document.getElementById('sum').textContent = `${sum} р.`;
};

onClickButton = async () => {
	if (!inputCost.value || !inputSpent.value) {
		alert("заполните все данные");
		return;
	} 

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

const updateCost = (event) => {
	valueCost = event.target.value;
};

const updateSpent = (event) => {
  valueSpent = event.target.value;
};

const render = async () => {
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

		box.addEventListener('dblclick', (e) => {
			editItem2(index);
		});

		container.appendChild(box);
		const boxPrice = document.createElement('div');
		boxPrice.className = 'expenses-boxPrice';
		boxPrice.addEventListener('dblclick', (e) => {
			editItem3(index);
		});
		container.appendChild(boxPrice);

		const numbering = document.createElement('p');
		numbering.textContent = `${index + 1} )`;
		
		numbering.onchange = () => {
			onChangeNumbering(index);
		}
		box.appendChild(numbering);

		if (index === curentIndex) {
				const inputTextScore = document.createElement('input');
				inputTextScore.type = 'text';
				inputTextScore.value = item.Score;
				inputTextScore.id = 'inputId2';
				container.appendChild(inputTextScore);
				box.className = 'displayNone';

				if (index === specificIndex) {
					inputTextScore.onblur = () => {
						onKeyStore(index);
					};
				};

				if (index === curentIndex || index === specificIndex2) {
					const inputTextCost = document.createElement('input');
					inputTextCost.type = 'number';
					inputTextCost.value = item.Cost;
					inputTextCost.id = 'inputId';
					container.appendChild(inputTextCost);

					if (index === specificIndex2) {
						inputTextCost.onblur = () => {
							onKeyCost(index);
						};
					};
				};
			
			if (index === curentIndex) {
				const boxImg = document.createElement('div');
				boxImg.className = 'expenses-boxImg';
				container.appendChild(boxImg);
				
				const imageClear = document.createElement('img'); 
				imageClear.src = 'images/clear.svg';
				boxImg.appendChild(imageClear);

				imageClear.onclick = () => {
					editClear(index);
				};

				const imageOk = document.createElement('img');
				imageOk.src = 'images/ok.svg';
				boxImg.appendChild(imageOk);
				imageOk.onclick = () => {
					editOk(index);
				};
			}
		} else {
			if (index === specificIndex) {
				const inputTextScore = document.createElement('input');
				inputTextScore.type = 'text';
				inputTextScore.value = item.Score;
				inputTextScore.id = 'inputId2';
				box.appendChild(inputTextScore);
					inputTextScore.onblur = () => {
						onKeyStore(index);
					};
			} else {
				const textScore = document.createElement('p');
				textScore.innerText = `Магазин "${item.Score}"`;
				box.appendChild(textScore);
			};

			if (index === specificIndex2) {
				const inputTextCost = document.createElement('input');
				inputTextCost.type = 'number';
				inputTextCost.value = item.Cost;
				inputTextCost.id = 'inputId';
				container.appendChild(inputTextCost);

				if (index === specificIndex2) {
					inputTextCost.onblur = () => {
						onKeyCost(index);
					};
				};
			
			} else {
				const textCost = document.createElement('p');
				textCost.innerText = `${item.Cost}  р.`;
				textCost.className = `textCost-expenses ${item.isCheck ? 'done-textCost' : ''}`
				boxPrice.appendChild(textCost);
			}

			const dateText = document.createElement('p')
			const boxImg = document.createElement('div');
			boxImg.className = 'expenses-boxImg';
			container.appendChild(boxImg);

			const imageEdit = document.createElement('img');
			imageEdit.src = 'images/edit.svg';
			boxImg.appendChild(imageEdit);

			imageEdit.onclick = () => {
				editItem(index);
			};

			const imageDelete = document.createElement('img');
			imageDelete.src = 'images/delete.svg';
			boxImg.appendChild(imageDelete);
		
			imageDelete.onclick = () => {
				deleteItem(index, container);
			};
			dateText.textContent = item.date;
			box.appendChild(dateText);
		};	
		content.appendChild(container);
	});
};

const onChangeNumbering = (index) => {
	allExpenses[index].isCheck = !allExpenses[index].isCheck;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	render();
};

const editOk = async (index) => {
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
			Score: inputSpent.value
		})
	});
	const result = await resp.json();
	allExpenses = result.data;
	curentIndex = null;
	specificIndex = null;
	specificIndex2 = null;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	sumFunction(allExpenses);
	render();
};

const editClear = (index) => {
	curentIndex = null;
	specificIndex = null;
	specificIndex2 = null;

	render();
};

const editItem = (index, item, container) => {
	curentIndex = index;
	
	render();
};

const editItem2 = (index, item, container) => {
	specificIndex = index;

	render();
};

const editItem3 = (index, item, container) => {
	specificIndex2 = index;

	render();
};

const onKeyCost = async (index) => {
	inputCost = document.getElementById('inputId');
	inputCost.addEventListener('change', updateCost);

	const resp = await fetch('http://localhost:8000/editExpenses', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Access-Control-Alow-Origin': '*'
		},
		body: JSON.stringify( {
			_id: allExpenses[index]._id,
			Cost: inputCost.value
		})
	});

	const result = await resp.json();
	
	allExpenses = result.data;
	curentIndex = null;
	specificIndex = null;
	specificIndex2 = null;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	sumFunction(allExpenses);
	render();
}

const onKeyStore = async (index) => {
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
			Score: inputSpent.value
		})
	});
	const result = await resp.json();
	allExpenses = result.data;
	curentIndex = null;
	specificIndex = null;
	specificIndex2 = null;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	sumFunction(allExpenses);
	render();
}

const deleteItem = async (index, item) => {
	const resp = await fetch(`http://localhost:8000/deleteExpenses?_id=${allExpenses[index]._id}`, {
		method: 'DELETE'
	});
	const result = await resp.json();
	allExpenses = result.data;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	sumFunction(allExpenses)
	render();
};

const deleteAll = async () => {
	const resp = await fetch('http://localhost:8000/deleteAllExpenses', {
		method: 'DELETE'
	});
	const result = await resp.json();
	allExpenses = result.data;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	render();
};