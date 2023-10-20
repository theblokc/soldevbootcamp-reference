

module.exports = function() {
  const htmlElement = (selector) => document.querySelector(selector)
  const web3 = require("@solana/web3.js")
  const anchor = require('@coral-xyz/anchor')

  // ELEMENTS
  const btnWallet = htmlElement(".btn-wallet")
  const btnDisconnect = htmlElement(".btn-disconnect")
  const textStatus = htmlElement(".text-status")
  const postContainer = htmlElement(".post-container")
  const formDapp = htmlElement(".form-dapp")

  //STATES
  let walletProvider;
  
  // FUNCTIONS

  // HELPER FUNCTIONS
  function getDatetime () {
    const dt = new Date();
    const dateString =  dt.toDateString() + " " + dt.toTimeString().split(" ")[0]
    return dateString
  }

  function renderPost (posts) {
    const lastIndex = posts.length - 1
    posts.forEach((p, idx) => {
      const titleElement = document.createElement("h1")
      const progIdElement = document.createElement("h2")
      const authorElement = document.createElement("h2")
      const dateCreatedElement = document.createElement("h3")

      // const p = document.createElement("p")
      const titleNode = document.createTextNode(`Title: ${p.account.title}`)
      const progIdNode = document.createTextNode(`Program ID: ${p.publicKey.toBase58()}`)
      const authorNode = document.createTextNode(`Author: ${p.account.author.toBase58()}`)
      const dateCreatedNode = document.createTextNode(`Date Created: ${p.account.createdAt}`)
      titleElement.appendChild(titleNode)
      progIdElement.appendChild(progIdNode)
      authorElement.appendChild(authorNode)
      dateCreatedElement.appendChild(dateCreatedNode)
      postContainer.appendChild(titleElement)
      postContainer.appendChild(progIdElement)
      postContainer.appendChild(authorElement)
      postContainer.appendChild(dateCreatedElement)

      if (p.account.updatedAt) {
        const dateUpdatedElement = document.createElement("h3")
        const dateUpdatedNode = document.createTextNode(`Date Updated: ${p.account.updatedAt}`)
        dateUpdatedElement.appendChild(dateUpdatedNode)
        postContainer.appendChild(dateUpdatedElement)
      }

      if (idx !== lastIndex) {
        const hr = document.createElement("hr")
        postContainer.appendChild(hr)
      }
    })
  } 

  function sortDateDescFn(a, b) {
    let dateA = new Date(a.account.createdAt).valueOf()
    let dateB = new Date(b.account.createdAt).valueOf()
    return dateB - dateA
  }

    /**
   *  Get your anchor program instance on chain. 
   *  Requires to have your anchor program IDL to be initialized.
   * @param {*} walletProvider 
   * @returns {Anchor.Program<T>}
   * where T is a struct declared in your anchor IDL.
   */
    async function getProgram(walletProvider) {
      window.Buffer = window.Buffer || require("buffer").Buffer;
      const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed")
      const anchorProvider = new anchor.AnchorProvider(connection, walletProvider, anchor.AnchorProvider.defaultOptions())
      return new anchor.Program(
        await anchor.Program.fetchIdl("8DCPDL7UJeWe9JtQ3QCf5E4dbngzZwZ7h1RrKbdHdVYm", anchorProvider),
        new web3.PublicKey("8DCPDL7UJeWe9JtQ3QCf5E4dbngzZwZ7h1RrKbdHdVYm"),
        anchorProvider
      )
    }
  
    /*
      Detect if phantom wallet is installed and set the provider to phantom wallet otherwise open the phantom website in a new tab to encourage users to install it
     */
    function detectProvider() {
      if ('phantom' in window) {
        console.log("PHANTOM IS PRESENT");
        let solanaProvider = window.phantom.solana
        if (solanaProvider?.isPhantom) {
          console.log("PROVIDER IS PHANTOM")
          console.log("PROVIDER: ", solanaProvider);
          walletProvider = solanaProvider;
          console.log(walletProvider)
        }
      } else {
        window.open('https://phantom.app/', '_blank');
      }
    }
  
    // Connects Wallet and get data from dApp
    async function connectWallet(walletProvider) {
      walletProvider.connect().then(async () => {
        console.log("Wallet is connected")
        btnWallet.style.display = "none"
        btnDisconnect.style.display = "inline-block"
        formDapp.style.display = "block"
        addElementText(textStatus, walletProvider?.isConnected)
        program = await getProgram(walletProvider)
        await getPosts()
      }).catch(e => {
        console.log(e)
      })
    }
  
    /**
     * Disconnects Wallet from dApp
     * @param {*} walletProvider 
     */
    async function disconnectWallet(walletProvider) {
      walletProvider.disconnect().then(async () => {
        btnWallet.style.display = "inline-block"
        btnDisconnect.style.display = "none"
        formDapp.style.display = "none"
        while (postContainer.firstChild) {
          postContainer.removeChild(postContainer.firstChild)
        }
      })
      .catch((e) => {
        console.log(e)
      })
    }
  
    function addElementText (element, text) {
      element.replaceChildren(document.createTextNode(text))
    }
  

  // RPC/ANCHOR METHODS
  async function getPosts() {
    const program = await getProgram(walletProvider)
    console.log("ENTER GET POSTS")
    const response = await program?.account.post.all()
    const sortedPosts = response.sort(sortDateDescFn)
    console.log(response)
    renderPost(response)
    // addElementText(postContainer, JSON.stringify(response))
  }

  async function createPost(postData) {
    const program = await getProgram(walletProvider)
    const post_account = web3.Keypair.generate()
    const accounts = {
      post: post_account.publicKey,
      account: new web3.PublicKey(walletProvider?.publicKey),
      system_program: web3.SystemProgram.programId
    }

    try {
      const tx = await program?.methods?.createPost(postData)?.accounts(accounts)?.signers([post_account])?.rpc()

      console.log("Create Post Signature: ", tx)

      await getPosts()
      
    } catch (e) {
      console.log("ERROR ON CREATE POST")
    }  
  }

  // LOAD EVENTS
  formDapp.addEventListener("submit", async (e) => {
    e.preventDefault()
    console.log("SUBMIT CLICKED")
    const [title] = e.target
    const postData = {
      title: title.value,
      content: null,
      createdAt: getDatetime(),
      updatedAt: null,
    }
    await createPost(postData)
  })

  // Event fired when connect wallet button event. Establish wallet connection for this event.
  btnWallet.addEventListener("click", (e) => {
    console.log("Wallet is clicked")
    connectWallet(walletProvider)
  })

  btnDisconnect.addEventListener("click", async (e) => {
    console.log("Disconnect is clicked")
    disconnectWallet(walletProvider)
  })

  // Fires the moment your website loads. Desired to detect the wallet for this event.
  window.addEventListener("DOMContentLoaded", () => {
    addElementText(textStatus, walletProvider?.isConnected ? walletProvider.isConnected : false)
    detectProvider()
  })


}
