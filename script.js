let allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
let valueCost= '';
let valueSpent = '';
let valueDate = '';
let textDate = new Date;
let inputCost = null;
let inputSpent = null;
let inputDate = null;
let flag = false;
let curentIndex;
let specificIndex;
let specificIndex2;
let specificIndex3;
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
	inputCost.addEventListener('keyup', updateCost);
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
	document.getElementById('sum').textContent = ` ${sum} р.`;
};

const onClickButton = async () => {
	inputCost = document.getElementById('add-expenses');
  inputSpent = document.getElementById('add-expenses2');
	inputCost.addEventListener('keyup', updateCost);
  inputSpent.addEventListener('change', updateSpent);
	
	if(inputCost.value && inputSpent.value) {
	const resp = await fetch('http://localhost:8000/createExpenses', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Access-Control-Alow-Origin': '*'
		},
		body: JSON.stringify( {
			Score: valueSpent,
			Cost: valueCost,
			date: testFunction(textDate)
		})
	});

	const result = await resp.json();
	allExpenses = result.data;
	valueCost= "";
  valueSpent = "";
	inputCost.value = "";
  inputSpent.value = "";
	
	sumFunction(allExpenses);
} else {
	alert('Введите все данные')
}

	render();
};

const updateCost = (event) => {
	if (!event.target.value.replace(/[^1-9]/g, '')) {
		alert('введите корректные данные')
	}
	inputCost.value = event.target.value.replace(/[^1-9]/g, '');
	valueCost = event.target.value;
};

const updateCostCheck = (event) => {
	if (!event.target.value.replace(/[^1-9]/g, '')) {
		alert('введите корректные данные')
	}
	event.target.value = event.target.value.replace(/[^1-9]/g, '');
};

const updateSpent = (event) => {
  valueSpent = event.target.value;
};

const updateDate = (event) => {
  valueDate = event.target.value;
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
		const boxDate= document.createElement('div');
		boxDate.className = 'expenses-boxDate';
		boxDate.addEventListener('dblclick', (e) => {
		editItem4(index);
		});
		container.appendChild(boxDate);

		const boxPrice = document.createElement('div');
		boxPrice.className = 'expenses-boxPrice';
		boxPrice.addEventListener('dblclick', (e) => {
			editItem3(index);
		});
		container.appendChild(boxPrice);

		const numbering = document.createElement('p');
		numbering.textContent = `${index + 1})`;
		
		numbering.onchange = () => {
			onChangeNumbering(index);
		}
		box.appendChild(numbering);

		if (index === curentIndex) {
				const inputTextScore = document.createElement('input');
				inputTextScore.type = 'text';
				inputTextScore.maxlength = '10';
				inputTextScore.value = item.Score;
				inputTextScore.id = 'inputId2';
				box.appendChild(inputTextScore);
				box.className = 'displayNone';

				if (index === specificIndex) {
					inputTextScore.onblur = () => {
						onKeyStore(index);
					};
				};

				if (index === curentIndex || index === specificIndex3) {
					const inputTextDate = document.createElement('input');
					inputTextDate.type = 'date';
					inputTextDate.value = item.date;
					inputTextDate.id = 'inputId3';
					boxDate.appendChild(inputTextDate);

					if (index === specificIndex3) {
						inputTextDate.onblur = () => {
							onKeyDate(index);
						};
					};
				};

				if (index === curentIndex || index === specificIndex2) {
					const inputTextCost = document.createElement('input');
					inputTextCost.type = 'number';
					inputTextCost.value = item.Cost;
					inputTextCost.id = 'inputId';
					boxPrice.appendChild(inputTextCost);
					inputTextCost.addEventListener('keyup', updateCostCheck);

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
				inputTextScore.maxlength="10" 
				inputTextScore.value = item.Score;
				inputTextScore.id = 'inputId2';
				box.appendChild(inputTextScore);
					inputTextScore.onblur = () => {
						if(inputTextScore.value === ''){
							alert('введите название магазина')
							
							render()
						} else {
							onKeyStore(index);
						}
					};
			} else {
				const textScore = document.createElement('p');
				textScore.className = "item_text"
				textScore.innerText = `Магазин "${item.Score}"`;
				box.appendChild(textScore);
			};

			if (index === specificIndex3) {
				const inputTextDate = document.createElement('input');
				inputTextDate.type = 'date';
				inputTextDate.min="1990-01-01";
				inputTextDate.max="2021-12-31";
				inputTextDate.value = item.date;
				inputTextDate.id = 'inputId3';
				boxDate.appendChild(inputTextDate);

				if (index === specificIndex3) {
					inputTextDate.onblur = (e) => {
						if (new Date(e.target.value).getFullYear() < 1990 || new Date(e.target.value).getFullYear() > 2021) {
							alert('Дата должна быть больше 2021 года и не меньше 1990 года');
						} else {
							onKeyDate(index);
						}
					};
				};
			} else {
				const dateText = document.createElement('p')
				dateText.textContent = item.date ;
				dateText.id = 'add-expenses3';
				boxDate.appendChild(dateText);
			}

			if (index === specificIndex2) {
				const inputTextCost = document.createElement('input');
				inputTextCost.type = 'number';
				inputTextCost.value = item.Cost;
				inputTextCost.id = 'inputId';
				
				inputTextCost.maxlength="9" ;
				container.appendChild(inputTextCost);

				inputTextCost.addEventListener('keyup', updateCostCheck);

				if (index === specificIndex2) {
					inputTextCost.onblur = () => {
						if (inputTextCost.value === '') {
							alert('введите данные расходов')
							
							render()
						} else if (inputTextCost.value.length > 6){
							alert('цена должна быть не больше 999999')
							
							render()
						} else {
							onKeyCost(index);
						}
						
					};
				};
			
			} else {
				const textCost = document.createElement('p');
				textCost.innerText = `${item.Cost} р.`;
				textCost.className = `textCost-expenses`
				boxPrice.appendChild(textCost);
			}

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
		
		};	
		content.appendChild(container);
	});
};

const editOk = async (index) => {
	inputCost = document.getElementById('inputId');
	inputCost.addEventListener('change', updateCost);

	inputSpent = document.getElementById('inputId2');
	inputSpent.addEventListener('change', updateSpent);

	inputDate = document.getElementById('inputId3');
	inputDate.addEventListener('change', updateDate);

	if (inputCost.value.length > 6) {
		alert('цена не должна превышать 999999')
	} else if (!inputCost.value.trim() || !inputSpent.value.trim()) { 
		alert('введите все данные')
	} else if (new Date(inputDate.value).getFullYear() < 1990 || new Date(inputDate.value).getFullYear() > 2021 ) {
		alert('Дата должна быть больше 2021 года и не меньше 1990 года')
	} else {
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
			date: inputDate.value
		})
	});
	const result = await resp.json();
	allExpenses = result.data;
	valueCost= "";
  valueSpent = "";
	inputCost.value = "";
  inputSpent.value = "";
	curentIndex = null;
	specificIndex = null;
	specificIndex2 = null;

	sumFunction(allExpenses);
  } 

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

const editItem4 = (index, item, container) => {
	specificIndex3 = index;

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

	sumFunction(allExpenses);
	render();
}

const onKeyDate = async (index) => {
	inputDate = document.getElementById('inputId3');
	inputDate.addEventListener('change', updateDate);

	const resp = await fetch('http://localhost:8000/editExpenses', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Access-Control-Alow-Origin': '*'
		},
		body: JSON.stringify( {
			_id: allExpenses[index]._id,
			date: inputDate.value
		})
	});
	const result = await resp.json();
	allExpenses = result.data;
	curentIndex = null;
	specificIndex = null;
	specificIndex2 = null;
	specificIndex3 = null;

	sumFunction(allExpenses);
	render();
}

const deleteItem = async (index, item) => {
	const resp = await fetch(`http://localhost:8000/deleteExpenses?_id=${allExpenses[index]._id}`, {
		method: 'DELETE'
	});
	const result = await resp.json();
	allExpenses = result.data;

	sumFunction(allExpenses)
	render();
};

const deleteAll = async () => {
	const resp = await fetch('http://localhost:8000/deleteAllExpenses', {
		method: 'DELETE'
	});
	const result = await resp.json();
	allExpenses = result.data;

	render();
};

const maxLengthCheck = (object) => {
  if (object.value.length > object.maxLength) {
		object.value = object.value.slice(0, object.maxLength)
	};
};

const getDate = (today) => {
	return today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
};

const getMonth = (today) => {
	return today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
};

const testFunction = (date) => {
	let today = date;
	return `${today.getFullYear()}-${getMonth(today)}-${getDate(today)}`;
}