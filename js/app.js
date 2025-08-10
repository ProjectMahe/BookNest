// Minimal frontend app for BookNest (static/demo data)
const sampleBooks = [
  {id:1,title:'The Alchemist',author:'Paulo Coelho',genre:'Fiction',rating:4.6,cover:'images/books/alchemist.jpg',desc:'A fable about following your dream.'},
  {id:2,title:'Atomic Habits',author:'James Clear',genre:'Self-help',rating:4.5,cover:'images/books/atomic.jpg',desc:'Proven strategies to build good habits.'},
  {id:3,title:'The Hobbit',author:'J.R.R. Tolkien',genre:'Fantasy',rating:4.8,cover:'images/books/hobbit.jpg',desc:'Classic tale of adventure.'},
  {id:4,title:'Educated',author:'Tara Westover',genre:'Memoir',rating:4.7,cover:'images/books/educated.jpg',desc:'A memoir about family and self-invention.'},
  {id:5,title:'Dune',author:'Frank Herbert',genre:'Sci-Fi',rating:4.4,cover:'images/books/dune.jpg',desc:'Epic science fiction saga.'}
];

// Save initial sample data to localStorage if not present
if(!localStorage.getItem('books')) localStorage.setItem('books', JSON.stringify(sampleBooks));
if(!localStorage.getItem('reviews')) localStorage.setItem('reviews', JSON.stringify([
  {name:'Asha',rating:5,comment:'Loved meeting fellow readers through BookNest!'},
  {name:'Rohit',rating:4,comment:'Swapped 2 books so far — easy and safe.'}
]));

const books = () => JSON.parse(localStorage.getItem('books')||'[]');
const reviews = () => JSON.parse(localStorage.getItem('reviews')||'[]');

// Utility renderers
function createBookCard(b){
  const el = document.createElement('div'); el.className='book-card';
  el.innerHTML = `
    <img src="${b.cover}" onerror="this.src='images/books/placeholder.jpg'" alt="${b.title}">
    <h4>${b.title}</h4>
    <p>${b.author}</p>
    <div style="margin-top:auto;display:flex;gap:8px;align-items:center">
      <a class="btn" href="details.html?id=${b.id}">Details</a>
      <button class="btn ghost" onclick="startSwap(${b.id})">Request Swap</button>
    </div>
  `;
  return el;
}

// Home: featured
if(document.getElementById('featured-grid')){
  const grid = document.getElementById('featured-grid');
  books().slice(0,4).forEach(b=>grid.appendChild(createBookCard(b)));
}

// Discover page
if(document.getElementById('discover-grid')){
  const grid = document.getElementById('discover-grid');
  const searchInput = document.getElementById('searchInput');
  const genreFilter = document.getElementById('genreFilter');
  const all = books();
  const genres = [...new Set(all.map(b=>b.genre))];
  genres.forEach(g=>{const o=document.createElement('option');o.value=g;o.textContent=g;genreFilter.appendChild(o)});
  function renderList(list){ grid.innerHTML=''; list.forEach(b=>grid.appendChild(createBookCard(b))); }
  renderList(all);
  document.getElementById('searchBtn').addEventListener('click',()=>{
    const q = searchInput.value.trim().toLowerCase();
    const g = genreFilter.value;
    const filtered = all.filter(b=>(!g||b.genre===g) && (b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q)));
    renderList(filtered);
  });
}

// Details page
if(document.getElementById('bookDetails')){
  const params = new URLSearchParams(location.search); const id = Number(params.get('id'));
  const b = books().find(x=>x.id===id) || books()[0];
  const el = document.getElementById('bookDetails');
  el.innerHTML = `
    <img src="${b.cover}" onerror="this.src='images/books/placeholder.jpg'" alt="${b.title}">
    <div>
      <h2>${b.title}</h2>
      <p class="muted">by ${b.author} • ${b.genre}</p>
      <p style="margin-top:12px">${b.desc}</p>
      <p style="margin-top:10px">⭐ ${b.rating}</p>
      <div style="margin-top:18px">
        <button class="btn" onclick="startSwap(${b.id})">Request Swap</button>
        <a class="btn ghost" href="swap.html">List your book</a>
      </div>
    </div>
  `;
}

// Swap form
if(document.getElementById('swapForm')){
  const form = document.getElementById('swapForm');
  form.addEventListener('submit',e=>{
    e.preventDefault(); const fd = new FormData(form);
    const obj = {id:Date.now(), title:fd.get('title'), author:fd.get('author'), genre:fd.get('genre')||'General', condition:fd.get('condition'), location:fd.get('location'), desc:fd.get('description'), cover:'images/books/placeholder.jpg'};
    const arr = books(); arr.unshift(obj); localStorage.setItem('books', JSON.stringify(arr));
    alert('Book listed successfully!'); form.reset(); location.href='profile.html';
  });
}

// Reviews
if(document.getElementById('reviewsList')){
  const list = document.getElementById('reviewsList');
  function renderReviews(){ list.innerHTML=''; reviews().forEach(r=>{
    const d = document.createElement('div'); d.className='form-card'; d.innerHTML=`<strong>${r.name}</strong><p>⭐ ${r.rating}</p><p>${r.comment}</p>`; list.appendChild(d);
  }); }
  renderReviews();
  document.getElementById('reviewForm').addEventListener('submit',e=>{
    e.preventDefault(); const fd=new FormData(e.target); const r = {name:fd.get('name'), rating:Number(fd.get('rating')), comment:fd.get('comment')}; const arr = reviews(); arr.unshift(r); localStorage.setItem('reviews', JSON.stringify(arr)); alert('Thanks for your review!'); e.target.reset(); renderReviews();
  });
}

// Profile
if(document.getElementById('yourBooks')){
  const grid = document.getElementById('yourBooks'); const arr = books();
  document.getElementById('booksCount').textContent = arr.length;
  document.getElementById('swapsCount').textContent = 0;
  arr.forEach(b=>grid.appendChild(createBookCard(b)));
}

// startSwap used across pages
window.startSwap = function(bookId){
  alert('Swap request sent! (demo) — exchange contact details in person to complete the swap.');
   }
