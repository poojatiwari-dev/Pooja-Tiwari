 let productData = null;
 let currentVariant = null;

 const modal = document.querySelector('#qv-modal');

 // OPEN QUICK VIEW

 document.addEventListener('click', async function(e) {
     const btn = e.target.closest('.quick-view-btn');
     if (btn) {

         const handle = btn.dataset.handle;
         const response = await fetch(`/products/${handle}.js`);
         productData = await response.json();
         // Title
         document.querySelector('#qv-title').innerHTML = productData.title;

         // Image
         document.querySelector('#qv-image').src = productData.featured_image;

         // Description
         const desc = document.querySelector('#qv-description');

         if (desc) {
             if (productData.description) {
                 desc.innerHTML = productData.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...';
                 desc.style.display = 'block';
             } else {
                 desc.style.display = 'none';
             }
         }

         // Default First Variant
         currentVariant = productData.variants[0];
         // Price
         document.querySelector('#qv-price').innerHTML = '₹' + (currentVariant.price / 100).toFixed(2);
         // Render Options
         renderOptions();
         modal.classList.add('active');
     }


     // CLOSE

    if (e.target.classList.contains('qv-close') || e.target.classList.contains('qv-overlay')) {
        modal.classList.remove('active');
    }

    // COLOR CHANGE

    if (e.target.classList.contains('qv-color')) {
        document.querySelectorAll('.qv-color').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        findVariant();
     }


     // ADD TO CART

     if (e.target.id === 'qv-add') {
         await fetch('/cart/add.js', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 id: currentVariant.id,
                 quantity: 1
             })
         });
         window.location.href = '/cart';
     }
 });

 // SIZE CHANGE

document.querySelector('#qv-size').addEventListener('change', function() {
        findVariant();
});


 // RENDER OPTIONS
 function renderOptions() {

     // Colors
     const colorsWrap = document.querySelector('#qv-colors');
     colorsWrap.innerHTML = '';
     productData.options[1].values.forEach((color, index) => {

      colorsWrap.innerHTML += `

      <button class="qv-color ${index == 0 ? 'active' : ''}" data-value="${color}">
       ${color}
      </button>

      `;

    }

     );


     // Sizes

     const sizeSelect =

         document.querySelector('#qv-size');
         sizeSelect.innerHTML = '';

     productData.options[0].values.forEach(
         size => {
             sizeSelect.innerHTML += `
                <option value="${size}">
                ${size}
                </option>`;
         }
     );
 }


 // FIND SELECTED VARIANT

 function findVariant() {

     const color = document.querySelector('.qv-color.active').dataset.value;
     const size = document.querySelector('#qv-size').value;
     alert(color);
     alert(size)
     const variant =
         productData.variants.find(v => {
             return (
                 v.options[0] === color &&
                 v.options[1] === size
             );
         });


     if (variant) {
         currentVariant = variant;

         // Update Price
         document.querySelector('#qv-price').innerHTML = '₹' +(currentVariant.price / 100).toFixed(2);

         // Update Image

         if (currentVariant.featured_image) {
             document.querySelector('#qv-image' ).src = currentVariant.featured_image.src;
         }
     }

 }