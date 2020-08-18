/* PRELOADER */
window.onload = () => {

    
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 30);
}

   const status = document.getElementById("status");
    const preloader = document.getElementById("preloader");

   fade(status)
    fade(preloader)
}

/* PRELOADER END */

 /* SELECTORS*/

 const korpaBtn = document.querySelector('.navbar__korpa');
 const closepopup = document.querySelector('.zatvoriMe');

 const popup = document.querySelector('.popup');
 const overlay = document.querySelector('.overlay');

 
 const korpapopupContent = document.querySelector('.popup__content');
 const produktiDiv = document.querySelector('.produkti__div');

 //Dodaj ovaj div .korpaMain na bilo koji page kako bi dobio funkcionalnost korpe
 const korpaMainContent = document.querySelectorAll('.korpaMain');

 const totalPrice = document.querySelectorAll('.totalPrice');
 const clearButton = document.querySelectorAll('.clear');
 const totalItems = document.querySelectorAll('.totalItems');

 const singleProductDiv = document.querySelector('.produktSingleDOM');
 const korpaPageDiv = document.querySelector('.myCart__korpa');


 //Single Product Page
 const displayDivSingle = document.querySelector(".produktSingleDOM");

//Forma Validation Selectors & Patterns

const inputs = document.querySelectorAll(".forma__input");
const forma = document.querySelector(".forma");
const submitBtn = document.querySelector(".forma__button");



 

 let korpa = [];

 let btnsDOM = []

 // DOHVATI PRODUKT
 class Products {
     async getProducts() {
         try {
           let result = await fetch ('produkti.json');
           let data = await result.json();
           let products = data.items;
           return products;
         } catch(error) {
           console.log(error);
         }
     }
 }

 // PRIKAZI PRODUKT

 class Interface {

  displayProducts(products) {
      let result = '';
      products.forEach(product => {


          result += `

          <div class="produkt">
          <h3 class="produkt__title">${product.title}</h3>
              <img src=${product.images[0]} alt="Produkt" class="produkt__img">
        
          <h4 class="produkt__price">€${product.price}</h4>

          <div class="produkt__buttons">
              
          
              <a href="/artikal.html" class="produkt__buttons--oko" data-id="${product.id}">
                  <i class="fas fa-eye"></i>
                  Pogledaj artikal
              </a>
       
              <button class="produkt__buttons--korpa" data-id="${product.id}">
                  <i class="fas fa-shopping-cart"></i>
                  Dodaj u korpu
              </button>
         
          </div>
      </div>
           
          `
      })

      produktiDiv ? produktiDiv.innerHTML = result : null  
      

  }

  

  getCartButtons() {
     let korpaBtns = [...document.querySelectorAll(".produkt__buttons--korpa")];

     btnsDOM = korpaBtns;

     korpaBtns.forEach(button => {
         const id = button.dataset.id;
         let inCart = korpa.find(item => item.id === id);
         if(inCart) {
            button.innerText = "U Korpi";
            button.disabled = true;
         } 
            
         button.addEventListener('click', e=> {
            e.target.innerText = "U Korpi";
            e.target.disabled  = true;
            //Get singular product
            let korpaItem = {...Storage.getProduct(id), amount:1};

            //Add product to cart

            korpa = [...korpa, korpaItem];

            //Save product to Storage
            Storage.saveKorpa(korpa);

            //Set cart values
            this.setKorpaValues(korpa);

            //Display cart item
            this.addKorpaItem(korpaItem);
            
            //Prikazi popup
            this.prikazipopupSingle();

         })  
      })
  }

  getSingleCartButton() {
  
        if(singleProductDiv) {
            singleProductDiv.addEventListener("click", e => {
                
                if (e.target.classList.contains("artikal__addItem") || e.target.classList.contains("fa-shopping-cart")) {
                  
                    const id = e.target.dataset.id;
                   
               /*      e.target.disabled  = true; */
                     
                    let productAmount = parseInt(e.target.previousElementSibling.value, 10);

                    let kupljen = korpa.find(item => item.id === id );

                    if(productAmount <= 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Molimo vas da unesete pozitivan broj.',
                        
                          })
                         
                    } else if (kupljen) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Artikal se već nalazi u korpi.',
                        
                          }).then(result => {
                              result.value ? this.prikazipopupSingle() : '';
                           
                          }) 
                        
                    } else {
                        //Get singular product amount
                        let korpaItem = {...Storage.getProduct(id), amount:productAmount};


                        //Add product to cart

                        korpa = [...korpa, korpaItem];

                                    //Save product to Storage
                        Storage.saveKorpa(korpa);

                        //Set cart values
                        this.setKorpaValues(korpa);

                        //Display cart item
                        this.addKorpaItem(korpaItem);
                        
                        //Prikazi popup
                        this.prikazipopupSingle();
                    }


                   
                    

                }
            })
        }


 }

  getViewButtons() {
    
    let viewBtns = [...document.querySelectorAll(".produkt__buttons--oko")];

    viewBtns.forEach(button => {
        const id = button.dataset.id;
           
        button.addEventListener('click', e=> {
      
           let korpaItem = {...Storage.getProduct(id), amount:1};  
            
             Storage.saveViewProducts(korpaItem);

          
        })  
     })
 }
  setKorpaValues(korpa) {
          
    let tempTotal = 0;
    let itemsTotal = 0;

    korpa.map(item => {
       tempTotal += item.price * item.amount;
       itemsTotal += item.amount;
    })


    totalPrice.forEach(item => {
        item.innerText = parseFloat(tempTotal.toFixed(2));
    })


    totalItems.forEach(item => {
        item.innerText = itemsTotal;
    })
    
  }



  addKorpaItem(item) {
    const div = document.createElement('div');
    div.classList.add('popup__korpa');
    div.innerHTML = `
    <img class="popup__korpa--img" src=${item.images[0]} alt="produkt">
          
            <div>
                
                <h4 class="popup__korpa--title">${item.title}</h4>
                <h5  class="popup__korpa--price">€${item.price}</h5>
                <span class="remove-item popup__korpa--remove" data-id=${item.id}> Ukloni </span>
            </div>

            <div class="popup__korpa--controls">
     
                <i class="fas fa-chevron-up popup__korpa--chevron" data-id=${item.id}></i>

                <p class="popup__korpa--cijena" data-id=${item.id}>${item.amount} </p>

                <i class="fas fa-chevron-down popup__korpa--chevron" data-id=${item.id}></i> 
            </div>
    
    
    
    `;

    const divStatic = document.createElement('div');
    divStatic.classList.add('popup__korpa');
    divStatic.classList.add('popup__static');
    divStatic.innerHTML = `
    <img class="popup__korpa--img" src=${item.images[0]} alt="produkt">
          
            <div>
                
                <h4 class="popup__korpa--title">${item.title}</h4>
                <h5  class="popup__korpa--price">€${item.price}</h5>

            </div>

            <div class="popup__korpa--controls">
     
           

                <p class="popup__korpa--cijena" data-id=${item.id}>${item.amount} </p>

       
            </div>
    
    
    
    `;
      
     /*    korpapopupContent.appendChild(div); */
        
        korpaMainContent.forEach(item => {
            item.appendChild(div)
        })

        korpaPageDiv ? korpaPageDiv.appendChild(divStatic) : ''
  
    }

    prikazipopup() {
        overlay.classList.toggle('promjenivis');
        popup.classList.toggle('pokaziKorpu');
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
    prikazipopupSingle() {
        overlay.classList.add('promjenivis');
        popup.classList.add('pokaziKorpu');
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

     
     setupAPP() {
         korpa = Storage.getKorpa();
         this.setKorpaValues(korpa)
         this.popuniKorpu(korpa);
         korpaBtn.addEventListener('click', this.prikazipopup)
         closepopup.addEventListener('click', this.sakrijpopup)
         
     }
      

     popuniKorpu(korpa) {
         korpa.forEach(item => this.addKorpaItem(item))
     }

     sakrijpopup() {
        overlay.classList.remove('promjenivis');
        popup.classList.remove('pokaziKorpu');
        
    }

    korpaLogic() {

        clearButton.forEach(btn =>  {
            btn.addEventListener('click', () => {
                this.clearCart();
            })
        })
      
        korpaMainContent.forEach(item => {
            item.addEventListener("click", e=> {
                if(e.target.classList.contains("remove-item")) {
                    let removeItem = e.target;
                    let id = removeItem.dataset.id;
                   removeItem.parentElement.parentElement.classList.add('cart__item--removed');
                   setTimeout(() => item.removeChild(removeItem.parentElement.parentElement), 250);
                    this.ukloniItem(id)
               } else if (e.target.classList.contains("fa-chevron-up")) {
                    let addAmount = e.target;
                    let id = addAmount.dataset.id;
                    let tempItem = korpa.find(item => item.id === id);
                    tempItem.amount = tempItem.amount + 1;
                    Storage.saveKorpa(korpa);
                    this.setKorpaValues(korpa);
                    addAmount.nextElementSibling.innerText = tempItem.amount
               } else if (e.target.classList.contains("fa-chevron-down")) {
                    let lowerAmount = e.target
                    let id = lowerAmount.dataset.id;
                    let tempItem = korpa.find(item => item.id === id);
                    tempItem.amount = tempItem.amount - 1;
                    if(tempItem.amount > 0) {
                    Storage.saveKorpa(korpa);
                    this.setKorpaValues(korpa);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;

                    } else {

                        Swal.fire({
                            title: 'Da li ste sigurni da želiti izbaciti ovaj artikal iz korpe ?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'rgba(220, 20, 60, 1)',
                            cancelButtonColor: 'rgba(46, 153, 41, 1)',
                            confirmButtonText: 'Da, izbaci artikal!',
                            cancelButtonText:'Odustani'
                          }).then((result) => {
                            if (result.value) {
                                lowerAmount.parentElement.parentElement.classList.add('cart__item--removed');
                                setTimeout(() => item.removeChild(lowerAmount.parentElement.parentElement), 250);
                                 this.ukloniItem(id)
                            }
                          })


                    }
            }  
            })
        })
      

        
    }

    clearCart() {
        let korpaItems = korpa.map(item => item.id);
        
       korpaItems.forEach(id => this.ukloniItem(id))
        while(korpapopupContent.children.length > 0) {
            korpapopupContent.removeChild(korpapopupContent.children[0])
        }
        this.sakrijpopup();

        korpaMainContent.forEach(item => {
            item.classList.add('cart__item--removed');
            setTimeout(() =>  item.innerHTML = "", 250);
        })

    } 

    ukloniItem(id) {
        korpa = korpa.filter(item => item.id != id)
        this.setKorpaValues(korpa);
        Storage.saveKorpa(korpa);
        let button = this.getSingleButton(id)
        if(button) {
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart"></i>
            Dodaj u korpu`; 
        }

    }

    getSingleButton(id) {
        return btnsDOM.find(button => button.dataset.id === id)
    }
 } //CLASS UI END

class SingleProduct {

    displaySingleProduct() {

            
        korpa = Storage.getKorpa();
        let gledaniArtikal = JSON.parse(localStorage.getItem('viewProduct'));
        const inCartItem = korpa.find(item => item.id === gledaniArtikal.id );

       gledaniArtikal = `
               
               <div class="artikal">
                
               <div class="artikal__lijeva"> 

               <img class="galerija__bigSlika" src="${gledaniArtikal.images[0]}" alt="Producti Image Featured">
               <div class="galerija">
               <img class="galerija__slika galerija__slika--1" ${!gledaniArtikal.images[0] ? `style="display:none"˙` : ''} src="${gledaniArtikal.images[0]}" alt="Product Image" >
               <img class="galerija__slika galerija__slika--2" ${!gledaniArtikal.images[1] ? `style="display:none"˙` : ''} src="${gledaniArtikal.images[1]}" alt="Product Image" >
               <img class="galerija__slika galerija__slika--3" ${!gledaniArtikal.images[2] ? `style="display:none"˙` : ''} src="${gledaniArtikal.images[2]}" alt="Product Image" >
               <img class="galerija__slika galerija__slika--4" ${!gledaniArtikal.images[3] ? `style="display:none"˙` : ''} src="${gledaniArtikal.images[3]}" alt="Product Image" >
               </div>

               </div>
                   

               <div class="artikal__desna"> 

               <h2 class="artikal__title">${gledaniArtikal.title}</h2>
               <p class="artikal__desc">${gledaniArtikal.desc}</p>

               <h4 class="artikal__price">€${gledaniArtikal.price}</h4>

               <div class="artikal__buttons">
              

                 
               <input class="artikal__input" type="number" pattern="^[0-9]" title='Only Number' min="1" step="1" value="${gledaniArtikal.amount}">

                   <button  class="artikal__addItem" data-id="${gledaniArtikal.id}">
                   
                       <i class="fas fa-shopping-cart" ></i>
                       Dodaj u korpu
                   </button>
           
               </div>
               
           </div>
               
           </div>

       ` 
       displayDivSingle ? displayDivSingle.innerHTML = gledaniArtikal : ''
    
          
    }

    initiateGallery() {

           const maleSlike = document.querySelectorAll(".galerija__slika");
           const bigyBoySlika = document.querySelector(".galerija__bigSlika");
           maleSlike.forEach(slika => slika.addEventListener("mouseover", e => {
           let src = e.target.getAttribute('src') 
           bigyBoySlika.setAttribute('src', src)
     
         }))
    }


  initSingleProduct() {


    this.displaySingleProduct();
    this.initiateGallery();

  }




}
//Forma Validation Class

 class Validation {

    validate(field, regex) {
       if(regex.test(field.value)) {
            field.classList.add('valid');
            field.classList.remove('invalid');
            field.nextElementSibling.classList.remove('validInfo');
         
        } else {
            field.classList.add('invalid');
            field.classList.remove('valid');
            field.nextElementSibling.classList.add('validInfo');
         
        } 
    }

    checkForClass(item) {
        return item.classList.contains('valid')
    }



     validatePayment() {


        const patterns = {
            name:/^[a-z\s]{1,}$/i,
            address:/^(?!\s*$).+/,
            phone:/^\d{9,}$/,
            email:/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]+)(\.[a-z]+)?$/
        }


       inputs.forEach(input => {
         input.addEventListener('keyup', e => {
            this.validate(e.target, patterns[e.target.attributes.name.value]) 
        })
        
       }) 

  
    if(forma) {

     forma.addEventListener('submit', e => {
         e.preventDefault();
 
         const inputCheck = [...inputs].filter(this.checkForClass) 
     

         if(inputCheck.length === 4 && korpa.length > 0) {
            
            Swal.fire({
                icon: 'success',
                title: 'Hvala Vam na povjerenju. Narudžba je poslana.',
          
              })
         } else if(inputCheck.length === 4 && korpa.length <= 0) {

            Swal.fire({
                icon: 'error',
                title: 'Nemate ništa u korpi. Odaberite artikal za kupovinu prije slanja forme.',
               
              })
         } else if (inputCheck.length < 4 ) {

            Swal.fire({
                icon: 'error',
                title: 'Molimo Vas da ispravno popunite formu prije slanja podataka.',
               
              })
         }
  
     })


     }
    }
 }

 //LOCAL STORAGE

 class Storage {
   static saveProducts(products) {
       localStorage.setItem("products", JSON.stringify(products))
   }

   static saveViewProducts(product) {
    localStorage.setItem("viewProduct", JSON.stringify(product))
}

   static getProduct(id) {
       let products = JSON.parse(localStorage.getItem('products'));
       return products.find(product => product.id === id)
   }

   static saveKorpa(korpa) {
       localStorage.setItem('korpa', JSON.stringify(korpa))
   }

   static getKorpa() {
       return localStorage.getItem('korpa') ? JSON.parse(localStorage.getItem('korpa')) : []
   }
 }




 document.addEventListener("DOMContentLoaded", () => {
     const interface = new Interface();
     const products = new Products();
     const validation = new Validation();
     const singleProduct = new SingleProduct;
     
       
     interface.setupAPP();
     validation.validatePayment();
     
  
 
     //GET PRODUCTS
     products.getProducts().then(products => {
        interface.displayProducts(products);
         Storage.saveProducts(products);
        }).then(() => {
            interface.getCartButtons();
            interface.getViewButtons();
            interface.getSingleCartButton();
            interface.korpaLogic(); 
            singleProduct.initSingleProduct(); 
        });
    
 })





 