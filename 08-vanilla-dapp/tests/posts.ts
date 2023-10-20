import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Posts } from "../target/types/posts";
import { assert } from "chai";

describe("posts", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  console.log("RPC URL", provider.connection.rpcEndpoint)

  const program = anchor.workspace.Posts as Program<Posts>;

  let postAccountKeypair = anchor.web3.Keypair.generate()

  let postAccounts: anchor.web3.Keypair[] = [];

  const dt = new Date();
  const dateString =  dt.toDateString() + " " + dt.toTimeString().split(" ")[0]
  
  const posts = [
    {
      title: "Post 1",
      content: "This is Post One",
      createdAt: dateString,
      updatedAt: null
    },
    {
      title: "Post 2",
      content: "This is Post Two",
      createdAt: dateString,
      updatedAt: null
    },
    
    {
      title: "Post 3",
      content: "This is Post Three",
      createdAt: dateString,
      updatedAt: null
    }
  ]

  it("can post content", async () => {
    // Add your test here.
    const accounts  = {
      // post: post.publicKey,
      author: provider.wallet.publicKey,
      system_program: anchor.web3.SystemProgram.programId
    }

    const promiseTransactions = posts.map(async (postData) => {
      let post = anchor.web3.Keypair.generate()
      postAccounts.push(post)
      return (await program.methods.createPost(postData).accounts({...accounts, post: post.publicKey}).signers([post]).rpc());
    })
    
    const transactions = await Promise.all(promiseTransactions)
    console.log("Transaction Signatures: ", transactions)
    console.log("Number of Transctions: ", transactions.length)
    console.log("Transaction Signatures: ", transactions)

    let newPost = await program.account.post.fetch(postAccounts[0].publicKey);
    const [result1, result2, result3] = (await program.account.post.all()).map(r => r.account).sort((a, b) => a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase() ? 1 : -1)

    console.log(result1, result2, result3)
    assert.ok(
      result1.title === posts[0].title && result2.title === posts[1].title && result3.title === posts[2].title
    );
  });

  it("can delete post", async () => {
    // Add your test here.
    const accounts  = {
      post: postAccounts[2].publicKey,
      author: provider.wallet.publicKey,
    }

    const existingPost = await program.account.post.fetch(accounts.post)

    console.log("To DELETE: ",existingPost.title)

    const tx = await program.methods.deletePost().accounts(accounts).rpc();
    
    console.log("Your transaction signature", tx);

    let deletedPost = await program.account.post.fetchNullable(accounts.post);

    assert.ok(deletedPost === null);
  });

  it("Can update content", async () => {
    // Add your test here.
    const accounts  = {
      post: postAccounts[1].publicKey,
      author: provider.wallet.publicKey,
    }

    const existingPost = await program.account.post.fetch(accounts.post)

    console.log("To Update: ",existingPost.title)

    const newDate = new Date();
    const newDateString =  newDate.toDateString() + " " + newDate.toTimeString().split(" ")[0]

    const updateData = {
      title: "Updated Post 2",
      content: "This is Updated Post Two",
      createdAt: null,
      updatedAt: newDateString,
    }

    const tx = await program.methods.updatePost(updateData).accounts(accounts).rpc();
    
    console.log("Transaction UPDATE signature: ", tx);

    let { title } = await program.account.post.fetch(postAccounts[1].publicKey);

    console.log("Uptaded Post: ", title)
    assert.strictEqual(title, updateData.title)
  });

});
