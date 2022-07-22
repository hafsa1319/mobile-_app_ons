const domainName = "onsbazaar.com";
const apiKey = "6oR6Ly6PqASERxhMMY0triB9Lmid6e4T";
const body = {
  "searches": [
    {
      "collection": "categories",
      "query_by": "Name",
      "filter_by": `domain:=${domainName}`,
      "use_cache": true,
      "cache_ttl": 60,
      "per_page": 250
    }
  ]
};
fetch("https://live.runtext.de/multi_search?q=", {
  method: 'POST',
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "X-TYPESENSE-API-KEY": apiKey
  },
  body: JSON.stringify(body)
})
  .then(res => res.json()
  ).then(data => CategoriesList(data))



function CategoriesList(CatResult) {
  let data = CatResult.results[0].hits;
  console.log(data)
  let catList = data[0].document.AvailableCategories;
  let menuBox = document.getElementById("menu");
  if(catList.length > 0) {
    catList.map(item => {
      if(!item.Text.includes(">>")) {
        let cat;
        const indexNum =data.findIndex( object => {
          return object.document.Name === item.Text;
        })
        if(indexNum !== -1) {
          menuBox.innerHTML += `<li><a data-index="0" class="category-list" data-catName="${item.Text}" >${item.Text}</a></li>`
        }
      }
    })
  }
  catListItems(catList)
  //CatList2(catList)
}

function catListItems(catList) {
  document.querySelectorAll(".category-list").forEach(element => {
    element.addEventListener("click", function () {
      element.classList.add("nav-url")
      let dataCatName = element.dataset.catname;
      if(element.classList.contains("active")) {
        element.classList.remove("active");
        setTimeout(function() {
          element.nextElementSibling.remove();
        },600)
      } else {
        element.classList.add("active");
        let subList = catList.filter(sub => sub.Text.includes(dataCatName))
        let tabIndex = element.dataset.index;
        if(tabIndex === "0") {
          let list = document.createElement("ul");
          list.classList.add("sublist");
          element.parentElement.append(list);
          subList.map(subItem => {
            let subArr = subItem.Text.split(">>");
            if(subArr.length > 1) {
              element.nextElementSibling.innerHTML += `<li class="sub-item"><a class="category-list-sub-item" data-index="${Number(tabIndex)+1}">${subArr[Number(tabIndex)+1]}</a></li>`
            }
          })
        }
      }
    })
  })
}

const menu = document.querySelector("#menu");
const pHandler = e => {
  if (e.target.tagName === 'A') { //This line also part of the event delegation
    let itemDataIndex = e.target.dataset.index;
  }
};
menu.addEventListener("click", pHandler)

function CatList2(catList) {
  document.querySelectorAll(".category-list").forEach(element => {
    element.addEventListener("click", function () {
      element.classList.add("nav-url")
      let dataCatName = element.dataset.catname;
        element.classList.add("active");
        let subList = catList.filter(sub => sub.Text.includes(dataCatName))
        let tabIndex = element.dataset.index;
        if(Number(tabIndex) > 1) {
          let list = document.createElement("ul");
          list.classList.add("sublist");
          element.parentElement.append(list);
          console.log(element.dataset.index)
          tabIndex = element.parentElement.previousElementSibling.dataset.index;
          subList.map(subItem => {
            console.log(subItem)
            let subArr = subItem.Text.split(">>");
            if(subArr.length > 2) {
              element.nextElementSibling.innerHTML += `<li class="sub-item"><a class="category-list" data-index="${Number(tabIndex)+1}">${subArr[Number(tabIndex)+1]}</a></li>`
            }
          })
        }
      
    })
  })
  
}

function CategoryDescription() {
  if(indexNum !== -1) {
    let catDesc = data[indexNum].document.Description;
    if(catDesc !== null && catDesc !== undefined) {
      cat = `<span class="desc" style="display: block;padding: 2px;border: 1px solid #c4c4c420;background-color: #00000020">${data[indexNum].document.Description}</span>`
      menuBox.innerHTML += `<li data-catName="${item.Text}">${item.Text} ${cat}</li>`;
    } else {
      menuBox.innerHTML += `<li data-catName="${item.Text}">${item.Text}</li>`
    }
  }
}
function CatListSubCategory(CatName) {

}
