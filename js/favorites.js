import { GithubUser } from "./githubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
    
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
    ('@github-favorites:')) || []
  
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExist = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())

      if(userExist) {
        throw new Error ('USUÁRIO JÁ CADASTRADO')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuario não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }

   
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }

  emptyTable() {
    if(this.entries.length == 0) {
      
      this.removeAllTr()
      
      const emptyRow = document.createElement('tr')
      emptyRow.innerHTML = `
        <td class="no-fav" colspan="4">
          <img src="../images/Estrela.svg" alt="ícone de estrela" />
          <span>Nenhum favorito ainda</span>
        </td>
        <td></td>
        <td></td>
        <td></td>
        `
      if (!this.tbody) return
      this.tbody.append(emptyRow)
    }
  }

  scroll() {

    if(this.entries.length <= 6) {
      this.tbody.style.maxHeight = '31.5rem'
    } else {
      this.tbody.style.maxHeight = '62.4rem'
    }
  
    if(this.entries.length <= 3) {
      const scrollbar = document.querySelector('#scrollbar')
      scrollbar.classList.add('hide')
    } else{
      scrollbar.classList.remove('hide')
    }
  
  
    if (this.entries.length <= 0){
      this.tbody.style.maxHeight = '62.4rem'
    }

  }

  scrollRotation() {
    const tbody = document.querySelector('tbody')
    const scrollbar = document.querySelector('#scrollbar')
    let initialPosition = 61; 

    tbody.scrollTop = 1;
  
  
    function updateScrollbar() {
      const tbodyHeight = tbody.scrollHeight;
      const visibleHeight = tbody.clientHeight;
      const scrollbarHeight = scrollbar.clientHeight;
      const maxScroll = tbodyHeight - visibleHeight;
  
      const scrollPercentage = (tbody.scrollTop / maxScroll) * 97;
      const maxScrollbarTop = visibleHeight - scrollbarHeight;
      const scrollbarTop = (scrollPercentage / 100) * maxScrollbarTop;
  
      scrollbar.style.top = scrollbarTop + initialPosition + 'px';
  }

  
  
    tbody.addEventListener('scroll', updateScrollbar);
    
  }


  
}

export class FavoritesView extends Favorites {
constructor(root) {
  super(root)

  this.tbody = this.root.querySelector('tbody')
  
  this.update()
  this.onadd()

}

onadd() {
  const addButton = this.root.querySelector('.search button')
  addButton.onclick = () => {
    const { value } = this.root.querySelector('.search input')
    this.add(value)
  }
}


  update() {
    this.removeAllTr()
    this.scroll()
    this.scrollRotation()
    this.emptyTable()

  this.entries.forEach( user => {
    const row = this.createRow()

    row.querySelector('.user img').src = `https://github.com/${user.login}.png`
    row.querySelector('.user img').alt = `imagem de ${user.name}`
    row.querySelector('.user p').textContent = user.name
    row.querySelector('.user a').href = `https://github.com/${user.login}`
    row.querySelector('.user span').textContent = `/${ user.login}`
    row.querySelector('.repositories').textContent = user.public_repos
    row.querySelector('.followers').textContent = user.followers

    row.querySelector('.btn').onclick = () => {
    const isOk = confirm('Deletar essa linha?')

      if(isOk) {
        this.delete(user)
      }


    }
    
    this.tbody.append(row)
  })

    
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/maykbrito.png" alt="" />
      <a href="https://github.com/maykbrito" target="_blank">
        <p>Mayk Brito</p>
        <span>maykbrito</span>
      </a>
    </td>
    <td class="repositories">123</td>
    <td class ="followers">1234</td>
    <td><button class="btn">Remover</button></td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove()
    })
  }

  

}