const getUrl = (start = 0) => {
 return `https://api.coinlore.net/api/tickers/?start=${start}&limit=10`
}


const getData = async (url) => {
  try {
    const data = await fetch(url);
    const response = await data.json();
    if(response) {
      const loading = document.querySelector('#loading');
      loading.textContent = '';
    }

    loadDataIntoTable(response);
  }
  catch(error) {
    console.log(error)
  }

}


const loadDataIntoTable = (data) => {
  let colName = [];
  let colSymbol = [];
  let rankCol = [];
  let priceCol = [];
  let percentChange = [];


  data['data'].forEach(({name, rank, price_usd, percent_change_24h, symbol}) => {
    colName.push(name);
    colSymbol.push(symbol);
    rankCol.push(rank);
    priceCol.push(price_usd);
    percentChange.push(percent_change_24h);



  });

  const Addfield = colName.map((_, index) => {

    return(
      `
      <tr>
      <td style='font-size:15px;'>${colName[index]} (${colSymbol[index]})</td>
       <td style='font-size:15px;'>${rankCol[index]}</td>
       <td style='font-size:20px;'>$${priceCol[index]}</td>
       <td class=${percentChange[index] >= 0 ? 'green-text text-darken-4' : 'red-text text-darken-4' } style='font-size: 25px;' >${percentChange[index]}</td>
      </tr>
      `
    )
  }).join('');

  const tableBody = document.querySelector('#crypto_table_data');
  tableBody.innerHTML = Addfield;

}

let clickedLink;


function handleNumberClick(clickedLink, leftArrow, rightArrow) {
  clickedLink.parentElement.classList = 'active';

  let clickedLinkPageNumber = parseInt(clickedLink.innerText);



  const url = getUrl((clickedLinkPageNumber * 10) - 10);
  getData(url);

  switch (clickedLinkPageNumber) {
    case 1:
    disableleftArrow(leftArrow);
    if(rightArrow.className.indexOf('disabled') !== -1) {
      enablerightArrow(rightArrow);
    }
    break;

    case 10:
    disablerightArrow(rightArrow) 
    if(leftArrow.className.indexOf('disabled') !== -1) {
      enableleftArrow(leftArrow);
    }
    break;
  
    default:
    if(leftArrow.className.indexOf('disabled') !== -1) {
      enableleftArrow(leftArrow);
    }
    if(rightArrow.className.indexOf('disabled') !== -1) {
      enablerightArrow(rightArrow)
    }
    break;
  }

}

const handleleftArrowClick = (activePageNumber, leftArrow, rightArrow) => {
let previouspage = document.querySelectorAll('li')[activePageNumber - 1];
previouspage.classList = 'active';
url = getUrl(((activePageNumber - 1) * 10) -10);
getData(url);

if(activePageNumber -1 === 1) {
disableleftArrow(leftArrow);
}

if(activePageNumber === 10) {
  enablerightArrow(rightArrow);
}





}


const disableleftArrow = (leftArrow) => {
  leftArrow.classList = 'disabled arrow-left';
  leftArrow.classList.remove('waves-effect')



}


const enableleftArrow = (leftArrow) => {
  leftArrow.classList.remove('disabled');
  leftArrow.classList = 'waves-effect arrow-left';
}





const handlerightArrowClick = (activatePageNumber , leftArrow, rightArrow) => {
let nextpage = document.querySelectorAll('li')[activatePageNumber + 1];

nextpage.classList = 'active';
url = getUrl(((activatePageNumber + 1) * 10) - 10);
getData(url);


if (activatePageNumber + 1 === 10) {
  disablerightArrow(rightArrow)
}

if(activatePageNumber === 1) {
  enableleftArrow(leftArrow)
}


}


const disablerightArrow = (rightArrow) => {
rightArrow.classList = 'disabled arrow-right';
rightArrow.classList.remove('waves-effect');
}


const enablerightArrow = (rightArrow) => {
  rightArrow.classList.remove('disabled');
  rightArrow.classList = 'waves-effect arrow-right';
}


const init = () => {
  const url = getUrl();
  getData(url)
}

init();


let pageLink = document.querySelectorAll('a');
let activePageNumber;
let leftArrow;
let rightArrow;
let url = '';



pageLink.forEach((link) => {
  link.addEventListener('click', function () {
   leftArrow = document.querySelector('.arrow-left');
   rightArrow = document.querySelector('.arrow-right');
   activeLink = document.querySelector('.active');


   activePageNumber = parseInt(activeLink.innerText);
  
   if((this.innerText === 'chevron_left' && activePageNumber === 1 ) || (this.innerText === 'chevron_right' && activePageNumber === 10)) return;


   activeLink.classList.remove('disabled');
   activeLink.classList = 'waves-effect';

   if(this.innerText === 'chevron_left') {
     handleleftArrowClick(activePageNumber, leftArrow, rightArrow);

   } else if(this.innerText === 'chevron_right') {
     handlerightArrowClick(activePageNumber, leftArrow, rightArrow);
   } else {
     handleNumberClick(this, leftArrow, rightArrow);
   }

  })
})