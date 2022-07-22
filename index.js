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
}
const categoryListBox = document.querySelector("#categoryList");
function catListItems(catList) {
  document.querySelectorAll(".category-list").forEach(element => {
    element.addEventListener("click", function () {
      element.classList.add("nav-url");
      let dataCatName = element.dataset.catname;
      categoryListBox.innerHTML = "";
      element.classList.add("active");
      let subList = catList.filter(sub => sub.Text.includes(dataCatName))
      let tabIndex = element.dataset.index;
      let slider = `<div class="container direction-rtl">
      <div class="card mb-3">
        <div class="card-body">
          <div class="row g-3">
          </div>
        </div>
      </div>
    </div>`;
      categoryListBox.innerHTML += slider;
      if(tabIndex === "0") {
        subList.map(subItem => {
          let subArr = subItem.Text.split(">>");
          if(subArr.length > 1) {
            document.querySelector("#categoryList .row").innerHTML += `<div class="col-4 category-sub-item" >
                                              <div class="feature-card mx-auto text-center">
                                                    <div class="card mx-auto bg-gray" data-index="${Number(tabIndex)+1}" data-name="${subArr[Number(tabIndex)+1]}"></div>
                                                    <p class="mb-0">${subArr[Number(tabIndex)+1]}</p>
                                                 </div>
                                          </div>`
          }
        })
      }
    })
  })
}

const menu = document.querySelector("#categoryList");
const pHandler = e => {
  if (e.target.classList.contains("card")) {
    let itemDataIndex = e.target.dataset.index;
    let itemCategoryName = e.target.dataset.name;
    subCategories(itemDataIndex,itemCategoryName);
  }
};
menu.addEventListener("click", pHandler)

function subCategories(itemDataIndex,itemCategoryName) {
  fetch("https://live.runtext.de/multi_search?q=", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-TYPESENSE-API-KEY": apiKey
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json()
    ).then(data => {
      let categories = data.results[0].hits;
      let catList = categories[0].document.AvailableCategories;
      document.querySelector("#categoryList .row").innerHTML = "";
      catList.map(cat => {
        let subArr = cat.Text.split(">>");
        if(subArr[Number(itemDataIndex)] === itemCategoryName) {
          document.querySelector("#categoryList .row").innerHTML += `<div class="col-4 category-sub-item" >
                                                <div class="feature-card mx-auto text-center">
                                                      <div class="card mx-auto bg-gray" data-index="${Number(itemDataIndex)+1}" data-name="${subArr[Number(itemDataIndex)+1]}"></div>
                                                      <p class="mb-0">${subArr[Number(itemDataIndex)+1]}</p>
                                                   </div>
                                            </div>`
        }
      })
    
  })
}
