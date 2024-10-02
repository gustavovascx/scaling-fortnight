const form = document.querySelector('form');
const container = document.querySelector('.image-container');
let filmes
const closeButton = document.getElementById('close-button') 
const dialog = document.getElementById('dialog')
const rating = document.getElementById('rating')
const genero = document.getElementById('genero')
const nome = document.getElementById('nome')
const favorito = document.getElementById('fav')
const favoritarButton = document.getElementById('favoritar-button')
let indiceSelect


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let query = form.querySelector('input').value;
    console.log(query)
    

    if(query==""){
        query="pokemon"
    }
    tvMazeApi(query)
})

async function tvMazeApi(query) {
    const req = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
    filmes = await req.json();
    console.log(filmes)

    criaImagens(filmes);
}


function criaImagens(filmes) {
    container.innerHTML = "";  

    filmes.forEach((filme, index) => {
        if (filme.show.image) {  
            const img = document.createElement('img');
            img.id = index
            
            img.onclick = (()=>{
                pegarDetalhes(index)
                indiceSelect = index
                console.log(indiceSelect)
            })
            img.src = filme.show.image.medium;  
            container.appendChild(img);  
        }
    });

}

function pegarDetalhes(id) {
    const ratingValue = filmes[id].show.rating.average || "Não Avaliado"; 
    const generoValue = filmes[id].show.genres.length > 0 ? filmes[id].show.genres : "Sem gênero disponível";
    const nomeValue = filmes[id].show.name || "Sem nome disponível";
    const favoritar = JSON.parse(localStorage.getItem("favorito"))
    genero.innerHTML = `Gênero 🎭 <span class="genero-value">${generoValue}</span>`;
    rating.innerHTML = `Avaliação ⭐ <span class="rating-value">${ratingValue}</span>`;
    nome.innerHTML = `Nome 🎬 <span class="nome-value">${nomeValue}</span>`;
    dialog.dataset.currentId = id;
    console.log("=", favoritar)
    console.log(favoritar?.filter(filme => filme.show.id === filmes[id].show.id).length)
    console.log(filmes[id].show.id)
        if(favoritar?.filter(filme => filme.show.id === filmes[id].show.id).length > 0) {
            favoritarButton.innerHTML = "Favoritado"
        } else {
            favoritarButton.innerHTML = "Favoritar"
        }

    dialog.show();
}

closeButton.addEventListener('click', (e)=>{
    e.preventDefault();
    dialog.close()
})

function addFav() {
    const listaFav = JSON.parse(localStorage.getItem("favorito"))
    if(Array.isArray(listaFav)) {
        localStorage.setItem("favorito", JSON.stringify([...listaFav, filmes[indiceSelect]]))
    } else {
        localStorage.setItem("favorito", JSON.stringify([filmes[indiceSelect]]))
    }
    favoritarButton.innerHTML = "Favoritado"
}


