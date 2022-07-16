import { GithubUser } from "./githubUser.js"

export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()

  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

 async add(userName) {
   
   try {
      const userExist = this.entries.find(entry => entry.login === userName)
      if(userExist) {
        throw new Error("Usuário já cadastrado!")
      }

      const user = await GithubUser.search(userName)

      if(user.login ===undefined) {
        throw new Error("Usuário não encontrado!")
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
    
    
  
  }
}

export class FavoritesView extends favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector("table tbody")
    this.update()
    this.forAdd()
  }

  forAdd() {
    const addButton = this.root.querySelector(".search button")

    addButton.onclick = () => {
      const {value} = this.root.querySelector(".search input")
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()
    this.setInitialAppearance()

    this.entries.forEach(user => {
      const tr = this.createTr()

      tr.querySelector(".user img").src = `https://github.com/${user.login}.png`
      tr.querySelector(".user img").alt = `Imagem de ${user.name}`
      tr.querySelector(".user a").href = `https://github.com/${user.login}`
      tr.querySelector(".user p").textContent = user.name
      tr.querySelector(".user span").textContent = `/${user.login}`
      tr.querySelector(".repositories").textContent = user.public_repos
      tr.querySelector(".followers").textContent = user.followers

      tr.querySelector(".remove").onclick = () => {
        const isOK = confirm("Deseja apagar está linha?")

        if(isOK) {
          this.delete(user)
          
        }
      }

      this.tbody.append(tr)

    })
  }


  createTr(){
    const tr = document.createElement("tr")

    tr.innerHTML = ` 
    <td class="user">
      <img src="" alt="">
      <a target="_blank" href="">
        <p></p>
        <span></span>
      </a>
    </td>
    <td class="repositories">
      123
    </td>
    <td class="followers">
      1234
    </td>
    <td>
      <button class="remove">Remover</button>
    </td>
    `

    return tr
  }

  setInitialAppearance() {
    const empty = this.root.querySelector(".empty")

    if(this.entries.length == 0) {
      empty.classList.remove("hide")
    } else {
      empty.classList.add("hide")
    }
  }

  removeAllTr() {
    

    this.tbody.querySelectorAll("tr").forEach(tr => {
      tr.remove()
      
    });
  }
}