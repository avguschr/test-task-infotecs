let limitInput = document.getElementById("limit");
let sortButton = document.getElementById("sort");

const listGenerating = (data, sort) => {
    let products = data;
    if (sort) {
        products.sort((a, b) => a.title.localeCompare(b.title));
    }
    let productsList = document.querySelector(".products__list");
    products.forEach((product) => {
        let item = document.createElement("li");
        productsList.appendChild(item).innerHTML = product.title;
        let desc = document.createElement("div");
        desc.classList.add("description");
        item.appendChild(desc).innerHTML = product.description;
    });

    productsListItems = productsList.getElementsByTagName("li");

    for (let item of productsListItems) {
        item.draggable = true;
        item.onmouseover = function () {
            let desc = this.querySelector(".description");
            desc.style.display = "block";
        };
        item.onmouseout = function () {
            let desc = this.querySelector(".description");
            desc.style.display = "none";
        };
    }

    productsList.ondragstart = (e) => {
        e.target.classList.add("selected");
    };

    productsList.ondragend = (e) => {
        e.target.classList.remove("selected");
    };
    const getNextEl = (cursor, current) => {
        const currentCoord = current.getBoundingClientRect();
        const currentCenter = currentCoord.y + currentCoord.height / 2;
        const next =
            cursor < currentCenter ? current : current.nextElementSibling;
        return next;
    };

 
    productsList.ondragover = (e) => {
        let nextElOfList;
        e.preventDefault();
        const active = productsList.querySelector(".selected");
        const current = e.target;
        if (active === current && current.nodeName !== "LI") return;

        const nextEl = getNextEl(e.clientY, current);

        if (
            (nextEl && active === nextEl.previousElementSibling) ||
            active === nextEl
        ) {
            return;
        }

        for (let item = 0; item < productsList.childElementCount; item++) {
            if (productsList.childNodes[item] === nextEl) {
                nextElOfList = productsList.childNodes[item];
            }
        }

        if (nextElOfList) {
            productsList.insertBefore(active, nextElOfList);
        }
    };
};


const getProducts = (limit, sort) => {
    fetch(`https://dummyjson.com/products?limit=${limit}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            listGenerating(data.products, sort);
        });
};


limitInput.onkeyup = () => {
    let productsList = document.querySelector(".products__list");
    productsList.innerHTML = "";
    if (limitInput.value) {
        getProducts(limitInput.value);
    }
};


sortButton.onclick = () => {
    let productsList = document.querySelector(".products__list");
    productsList.innerHTML = "";
    if (limitInput.value) {
        getProducts(limitInput.value, (sort = true));
    }
};

getProducts(limitInput.value);
