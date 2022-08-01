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
  .then(res => res.json())
  .then(data => CategoriesList(data))

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
  catListItems(catList,CatResult)
  
}
const categoryListBox = document.querySelector("#categoryList");
function catListItems(catList) {
  document.querySelectorAll(".category-list").forEach(element => {
    
    element.addEventListener("click", function () {
      document.querySelector("#productDetail").innerHTML = "";
      document.querySelector("#categoryList").classList.remove("d-none");
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
      if (tabIndex === "0") {
        let subArr= [];
        subList.map(subItem => {
          let newSubArr = subItem.Text.split(">>");
          if (newSubArr.length > 1) {
            subArr.push(newSubArr[1].trim(" "))
          }
        });
        subArr = subArr.filter(function (x, i, a) {
          return a.indexOf(x) === i;
        });
        subArr.map(x => {
          document.querySelector("#categoryList .row").innerHTML += `<div class="col-4 category-sub-item" >
                                              <div class="feature-card mx-auto text-center">
                                                    <div class="card mx-auto" ></div>
                                                    <p class="mb-0" data-index="${Number(tabIndex) + 1}" data-name="${x}">${x}</p>
                                                 </div>
                                          </div>`
        })
      }
      allProducts(dataCatName)
     
    })
  })
}

const menu = document.querySelector("#categoryList");
const pHandler = e => {
  if (e.target.tagName === "P") {
    let itemDataIndex = e.target.dataset.index;
    let itemCategoryName = e.target.dataset.name;
    subCategories(itemDataIndex,itemCategoryName);
    allProducts(itemCategoryName);
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
    .then(res => res.json())
    .then(data => {
      let categories = data.results[0].hits;
      let catList = categories[0].document.AvailableCategories;
      document.querySelector("#categoryList .row").innerHTML = "";
      let subItems = [];
      catList.map(cat => {
        let subArr = cat.Text.split(">>");
        if(subArr.length > Number(itemDataIndex)+1) {
          if(subArr[Number(itemDataIndex)].trim(" ") === itemCategoryName) {
            subItems.push(subArr[Number(itemDataIndex)+1].trim(" "));
            
          }
        }
      })
    subItems = subItems.filter(function (x, i, a) {
      return a.indexOf(x) === i;
    });
      subItems.map(x => {
        document.querySelector("#categoryList .row").innerHTML += `<div class="col-4 category-sub-item" >
                                                <div class="feature-card mx-auto text-center">
                                                      <div class="card mx-auto bg-gray" data-index="${Number(itemDataIndex)+1}" data-name="${x}"></div>
                                                      <p class="mb-0">${x}</p>
                                                   </div>
                                            </div>`;
      })
  })
}
// TODO All Products Fetch
function allProducts(categoryName) {
  fetch("https://live.runtext.de/multi_search?q=", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-TYPESENSE-API-KEY": "HjLvLXNtyHLIFgWmrxHK1sBvF5SUC2HD"
    },
    body: JSON.stringify({
      "searches": [
        {
          "collection": "allProducts",
          "query_by": "Name",
          "filter_by": `domain:=${domainName} && CategoryNames:=['${categoryName}']`,
          "use_cache": true,
          "cache_ttl": 60,
          "per_page": 250
        }
      ]
    })
  })
    .then(res => res.json())
    .then(data => {
      let selectCategoryProducts = data.results[0].hits;
      console.log({selectCategoryProducts})
      document.querySelector("#productList").innerHTML = "";
      selectCategoryProducts.map(product => {
        let name = product.document.Name;
        let price = product.document.Price;
        let currency = product.document.Currency;
        let link = product.document.domain +"/"+ product.document.Sname;
        let id = product.document.id;
        let img = product.document.ProductPictureModels.Data[0].PictureUrl;
        //let img = product.document;
        document.querySelector("#productList").innerHTML += shopListItem(name,img,price,"",currency,link,id);
      })
      productDetail(selectCategoryProducts)
    })
}

function shopListItem(name,img,price,oldPrice,currency,link,id) {
  return `<div class="col-12 position-relative">
            
              <div class="card single-product-card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="card-side-img">
                      <!-- Product Thumbnail-->
                      <a class="product-thumbnail d-block" href="https://${link}"><img src="${img}" alt="">
                    </div>
                    <div class="card-content px-4 py-2">
                      <!-- Product Title--><a class="product-title d-block text-truncate mt-0" href="https://${link}">${name}</a>
                      <!-- Product Price-->
                      <p class="sale-price">${currency}${price}<span>${currency}${oldPrice}</span></p>
                      <!-- Add To Cart Button-->
                      <a class="btn btn-outline-info btn-sm" href="#">
                        <svg class="bi bi-cart me-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                        </svg>Add to Cart</a>
                        <div class="product-details-box" id="${id}"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>`
}


function productDetail(products) {
  document.querySelectorAll(".product-details-box").forEach(element => {
    element.addEventListener("click", function () {
      let product = products.filter(item => item.document.id === this.id)
      product = product[0].document;
      function imgSlider() {
        if(product.ProductPictureModels.Data.length > 1) {
          product.ProductPictureModels.Data.map(element => {
            console.log(element.PictureUrl)
            document.querySelector("#productImages").innerHTML += `<a href="#"><img class="rounded" src="${element.PictureUrl}" alt=""></a>`
          })
        }
      }
      
      console.log(product)
      const productDetail = `
      <div class="page-content-wrapper py-3">
      <div class="container">
        <div class="card product-details-card mb-3"><span class="badge bg-warning text-dark position-absolute product-badge">Sale -10%</span>
          <div class="card-body">
            <div class="product-gallery-wrapper">
              <div class="product-gallery" id="productImages">
              
</div>
            </div>
          </div>
        </div>
        <div class="card product-details-card mb-3 direction-rtl">
          <div class="card-body">
            <h1 class="h3">${product.Name}</h1>
            <h3 class="h1 mt-3">${product.Price} ${product.Currency}</h3>
            <p >${product.ShortDescription}</p>
            <form action="#" class="mt-3">
              <div class="input-group">
                <button class="btn btn-primary w-100" type="submit">Add to Cart</button>
              </div>
            </form>
          </div>
        </div>
        <div class="card product-details-card mb-3 direction-rtl">
          <div class="card-body">
            <h5>Description</h5>
            <div class="product-description">${product.Description}</div>
            <div class="rating-card-two mt-4">
              <!-- Rating result -->
              <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <div class="rating"><a href="#"><i class="bi bi-star-fill"></i></a><a href="#"><i class="bi bi-star-fill"></i></a><a href="#"><i class="bi bi-star-fill"></i></a><a href="#"><i class="bi bi-star-fill"></i></a><a href="#"><i class="bi bi-star-half"></i></a></div><span>4.44 out of 5 ratings</span>
              </div>
              <!-- Rating Details -->
              <div class="rating-detail">
                <!-- Single Rating Details -->
                <div class="d-flex align-items-center mt-2"><span>5 star</span>
                  <div class="progress-bar-wrapper">
                    <div class="progress">
                      <div class="progress-bar bg-warning" style="width: 78%;" role="progressbar" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div><span>78%</span>
                </div>
                <!-- Single Rating Details -->
                <div class="d-flex align-items-center mt-2"><span>4 star</span>
                  <div class="progress-bar-wrapper">
                    <div class="progress">
                      <div class="progress-bar bg-warning" style="width: 14%;" role="progressbar" aria-valuenow="14" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div><span>14%</span>
                </div>
                <!-- Single Rating Details -->
                <div class="d-flex align-items-center mt-2"><span>3 star</span>
                  <div class="progress-bar-wrapper">
                    <div class="progress">
                      <div class="progress-bar bg-warning" style="width: 8%;" role="progressbar" aria-valuenow="8" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div><span>8%</span>
                </div>
                <!-- Single Rating Details -->
                <div class="d-flex align-items-center mt-2"><span>2 star</span>
                  <div class="progress-bar-wrapper">
                    <div class="progress">
                      <div class="progress-bar bg-warning" style="width: 0%;" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div><span>0%</span>
                </div>
                <!-- Single Rating Details -->
                <div class="d-flex align-items-center mt-2"><span>1 star</span>
                  <div class="progress-bar-wrapper">
                    <div class="progress">
                      <div class="progress-bar bg-warning" style="width: 0%;" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div><span>0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      `;
      document.querySelector("#productDetail").innerHTML += productDetail;
      document.querySelector("#productList").innerHTML = "";
      document.querySelector("#categoryList").classList.add("d-none");
      imgSlider()
      sliderUpdate()
    })
  })
}


function sliderUpdate() {
    tns({
        container: '.product-gallery',
        items: 1,
        slideBy: 'page',
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 5000,
        speed: 750,
        mouseDrag: true,
        controls: false,
        nav: false
    });
}

