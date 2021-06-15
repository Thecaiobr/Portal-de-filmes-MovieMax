const apiKey = config.API_KEY
const baseURL = 'http://image.tmdb.org/t/p/'

var filmesPopulares = []

//Função que puxa os dados da API de filmes populares
function getTrendingList () {
  const url = `https://api.themoviedb.org/3//movie/popular?api_key=${apiKey}`

  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(res => {
      filmesPopulares = res.results

      setBannerImage(filmesPopulares)
      setTitle()
      setMoviesTable(filmesPopulares)
    })
}

//Função que permite visualizar a descrição do filme ao clicar em cima do seu ícone na tabela de filmes
//Logo após isso ele gerará a aba com recomendações de filmes parecidos com os buscados por voce
function getRecomendations (item) {
  const url = `https://api.themoviedb.org/3/movie/${item.id}/recommendations?api_key=${apiKey}`

  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(res => {
      let itens = res.results
      var recommendations = document.getElementById('recommendations')

      for (var i = 0; i < itens.length; i++) { 
        let item = itens[i]
        let template = document.getElementById('recomendationsTemplate').content.cloneNode(true)
        template.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w154/${item.poster_path}` : 'https://via.placeholder.com/154x239.png?text=NO+IMAGE'
        template.querySelector('.movie-title').innerText = item.original_title
        template.querySelector('.item').onclick = setMovie.bind(event, item)
        recommendations.appendChild(template)
      }
    })
}

//Função que realiza a busca do filme solicitado na barra de pesquisa
//é realizado pelo recurso de busca disponiblizado pela API
function search (page) {
  let searchInput = document.getElementById('searchInput').value

  clearMovie()
  clearTitle()
  clearRecommendation()
  clearPagination()

  if (!searchInput) {
    setTitle()
    setMoviesTable(filmesPopulares)
    return
  }
  //link do recurso da API
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=${page}&query=${searchInput}`

  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(res => {
      setMoviesTable(res.results)
      setPagination(res)
    })
}

//Função que gera a tabela de filmes a partir da busca do título do filme
//Ao apagar toda a escrita da barra de busca, essa tabela some, e só reaparece quando uma nova busca for realizada
function setMoviesTable (itens) {
  clearMoviesTable()
  var moviesTable = document.getElementById('moviesTable')

  for (var i = 0; i < itens.length; i++) {
    let item = itens[i]
    let template = document.getElementById('movieListTemplate').content.cloneNode(true)
    template.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w45/${item.poster_path}` : 'https://via.placeholder.com/45x68.png?text=NO+IMAGE'
    template.querySelector('.movie-title').innerText = item.original_title
    template.querySelector('.movie-release-year').innerText = item.release_date.slice(0, 4)
    template.querySelector('.item').onclick = setMovie.bind(event, item)
    moviesTable.appendChild(template)
  }
}

//Função que cria os botões que direcionam para mais página de opções de filme
//Botões esses encontrados antes da parte de Em destaque, clique nele para excutar esta função
function setPagination (res) {
  clearPagination()

  if (!res.total_results) {
    var title = document.getElementById('title')
    let template = document.getElementById('titleTemplate').content.cloneNode(true)
    template.querySelector('.title').innerText = 'No data available'
    title.appendChild(template)
  } else {
    for (var i = 1; i <= res.total_pages; i++) {
      var pager = document.getElementById('pager')
      let template = document.getElementById('pagerTemplate').content.cloneNode(true)
      template.querySelector('.button').innerText = i
      template.querySelector('.button').onclick = search.bind(event, i)
      if (i !== res.page) {
        template.querySelector('.button').classList.add('is-secondary')
      }
      pager.appendChild(template)
    }

    var title = document.getElementById('title')
    var template = document.getElementById('resultsTemplate').content.cloneNode(true)
    template.querySelector('.results').innerText = 'Results'
    template.querySelector('.label').innerText = res.total_results
    title.appendChild(template)
  }
}

//Função que apresenta a descrição e sinópse(overview) do filme selecionado na tabela
function setMovie (item) {
  clearMoviesTable()
  clearPagination()
  clearTitle()
  clearMovie()
  clearRecommendation()

  getRecomendations(item)

  var movie = document.getElementById('movie')
  var template = document.getElementById('movieTemplate').content.cloneNode(true)//O método Node.cloneNode() duplica um elemento node (nó) da estrutura de um documento DOM. Ele retorna um clone do elemento para o qual foi invocado.
  template.querySelector('.title').innerText = item.original_title
  template.querySelector('.movie-release-year').innerText = item.release_date.slice(0, 4)
  template.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w342/${item.poster_path}` : 'https://via.placeholder.com/342x513.png?text=NO+IMAGE'
  template.querySelector('.overview').innerText = item.overview
  movie.appendChild(template)
}

//seleciona o titulo de cada página
function setTitle () {
  var title = document.getElementById('title')
  var template = document.getElementById('titleTemplate').content.cloneNode(true)
  template.querySelector('.title').innerText = 'Lista de filmes'
  title.appendChild(template)
}

//limpa a tabela de filmes
function clearMoviesTable () {
  moviesTable.innerHTML = ''
}

// limpa a paginacao
function clearPagination () {
  pager.innerHTML = ''
}

//  limpa o titulo da pagina
function clearTitle () {
  title.innerHTML = ''
}

// limpa o filme
function clearMovie () {
  movie.innerHTML = ''
}

//limpa recomendações
function clearRecommendation () {
  recommendations.innerHTML = ''
}

//Ao carregar a página executa a função que carrega o recurso dos filmes populares da API
window.onload = function() {
  getTrendingList()

  // Executa a função Search quando o usuário prescionar a tecla Enter
  let searchInput = document.getElementById("searchInput")

  searchInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      search()
    }

    if (!searchInput.value) {
      clearPagination()
      clearRecommendation()
      clearTitle()
      clearMovie()

      setTitle()
      setMoviesTable(filmesPopulares)
    }
  })

  searchInput.focus()
}


