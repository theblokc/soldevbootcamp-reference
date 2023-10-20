use anchor_lang::prelude::*;

declare_id!("8DCPDL7UJeWe9JtQ3QCf5E4dbngzZwZ7h1RrKbdHdVYm");

#[program]
pub mod posts {
    use super::*;

    pub fn create_post(ctx: Context<CreatePost>, post: Post) -> Result<()> {
        msg!("ENTER CREATE POST");
        let post_account = &mut ctx.accounts.post;
        let author = &mut ctx.accounts.author;
        post_account.title = post.title;
        post_account.content = post.content;
        post_account.created_at = post.created_at;
        post_account.author = *author.key;
        msg!("POST: {:?}", post_account);
        msg!("EXIT CREATE POST");
        Ok(())
    }

    pub fn update_post(ctx: Context<UpdatePost>, post: Post) -> Result<()> {
        msg!("ENTER UPDATE POST");
        let post_account = &mut ctx.accounts.post;
        msg!("POST BEFORE UPDATE: {:?}", post_account);
        // post_account.title = post;
        post_account.title = Some(post.title).unwrap_or(post_account.title.clone());
        post_account.content = Some(post.content).unwrap_or(post_account.content.clone());
        post_account.updated_at = post.updated_at;
        msg!("POST AFTER UPDATE: {:?}", post_account);
        msg!("EXIT UPDATE POST");
        Ok(())
    }
    
    pub fn delete_post(_ctx: Context<DeletePost>) -> Result<()> {
        msg!("ENTER DELETE POST");
        msg!("EXIT DELETE POST");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(init, payer = author, space = Post::MAX_SIZE)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(mut)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>

}

#[derive(Accounts)]
pub struct DeletePost<'info> {
    #[account(mut, has_one = author, close = author)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>
}

#[account]
#[derive(Debug)]
pub struct Post {
    pub title: Option<String>,
    pub content: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
    pub author: Pubkey
}

impl Post {
    pub const MAX_SIZE: usize = 8 + (5 + 50) + (5 + 1000) + ((5 + 30) * 2) + 32;
}