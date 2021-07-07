let allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
let valueInput = '';
let valueInput2 = '';
let input = null;
let input2 = null;
let flag = false;
let curentIndex;
let text;
let text2;
let sum;

window.onload = async function init () {
	input = document.getElementById('add-expenses');
  input2 = document.getElementById('add-expenses2');
	input.addEventListener('change', updateValue);
  input2.addEventListener('change', updateValue2);

	const resp = await fetch('http:/localhost:8000/allExpenses', {
		method: 'GET'
	});
	const result = await resp.json();
	allExpenses = result.data;

	sumFunction();
	render();
};	

sumFunction = async () => {
	const resp2 = await fetch('http:/localhost:8000/ExpensesSum', {
		method: 'GET'
	});
	const result2 = await resp2.json();
	sum = result2.sum;
	document.getElementById('sum').textContent = sum ;
}

onClickButton = async () => {
	const resp = await fetch('http://localhost:8000/createExpenses', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Access-Control-Alow-Origin': '*'
		},
		body: JSON.stringify( {
			text: valueInput ,
      text2: valueInput2,
		})
	});
	sumFunction();
	const result = await resp.json();
	allExpenses = result.data;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));
	localStorage.setItem('sum', sum);
	valueInput = "";
  valueInput2 = "";
	input.value = "";
  input2.value = "";

	render();
};

updateValue = (event) => {
	valueInput = event.target.value;
};

updateValue2 = (event) => {
  valueInput2 = event.target.value;
};

render = async ()  => {
	const content = document.getElementById('content-page');

	while(content.firstChild) {
		content.removeChild(content.firstChild);
	};
		
	allExpenses.map((item, index) => {
		const container = document.createElement('div');
		container.id = `expenses-${index}`;
		container.className = 'expenses-container';
		const checkbox = document.createElement('p');

		checkbox.onchange = function () {
			onChangeCheckBox(index);
		}
		container.appendChild(checkbox);

		if (index === curentIndex) {
			const text2 = document.createElement('input');
			text2.type = 'text';
			text2.value = item.text2;
			text2.id = 'inputId2';
			container.appendChild(text2);

			const text = document.createElement('input');
			text.type = 'text';
			text.value = item.text;
			text.id = 'inputId';
			container.appendChild(text);

			const imageClear = document.createElement('img'); 
			imageClear.src = 'images/clear.svg';
			container.appendChild(imageClear);

			imageClear.onclick = function () {
				EditClear(index);
			};

			const imageOk = document.createElement('img');
			imageOk.src = 'images/ok.svg';
			container.appendChild(imageOk);
			imageOk.onclick = function () {
				EditOk(index);
			};
		} else {
			const text2 = document.createElement('p');
			const text = document.createElement('p');
			text2.innerText = item.text2;
			text.innerText = item.text;
			text.className = item.isCheck ? 'text-expenses done-text' : 'text-expenses';
      
			container.appendChild(text2);
			container.appendChild(text);
		};	

		const imageEdit = document.createElement('img');
		imageEdit.src = 'images/edit.svg';
		container.appendChild(imageEdit);

		imageEdit.onclick = function () {
			EditItem(index);
		};

		const imageDelete = document.createElement('img');
		imageDelete.src = 'images/delete.svg';
		container.appendChild(imageDelete);
	
		imageDelete.onclick = function () {
			DeleteItem(index,container);
		};
		content.appendChild(container);
	});
};

onChangeCheckBox = (index) => {
	allExpenses[index].isCheck = !allExpenses[index].isCheck;
	localStorage.setItem('expenses', JSON.stringify(allExpenses));

	render();
};

EditOk = async (index) => {
	input = document.getElementById('inputId');
	input.addEventListener('change', updateValue);

	input2 = document.getElementById('inputId2');
	input2.addEventListener('change', updateValue2);

	console.log("gg", input2.value)

	const resp = await fetch('http://localhost:8000/editExpenses', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Access-Control-Alow-Origin': '*'
		},
		body: JSON.stringify( {
			text: input.value,
			text2: input2.value
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
	console.log(allExpenses[index]._id);
	const result = await resp.json();
	allExpenses = result.data;
	localStorage.setItem('tasks', JSON.stringify(allExpenses));

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