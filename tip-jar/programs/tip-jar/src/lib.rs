use anchor_lang::prelude::*;

declare_id!("A1qE6kdjYwk9bTHXeaAJrUYMYJUuuLJhypC1LWMLmBhW");

#[program]
pub mod tip_jar {
   use super::*;

    pub fn send_tip(ctx: Context<SendTip>, amount: u64) -> Result<()> {
        let tip = &mut ctx.accounts.tip;
        tip.sender = ctx.accounts.from.key();
        tip.recipient = ctx.accounts.to.key();
        tip.amount = amount;
        tip.timestamp = Clock::get()?.unix_timestamp;

        // Transfer SOL
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.from.key(),
            &ctx.accounts.to.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.from.to_account_info(),
                ctx.accounts.to.to_account_info(),
            ],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendTip<'info> {
    #[account(mut)]
    pub from: Signer<'info>,

    #[account(mut)]
    pub to: SystemAccount<'info>,

    #[account(
        init_if_needed,
        payer = from,
        space = 8 + Tip::INIT_SPACE,
        seeds = [
            b"tip",
            from.key().as_ref(),
            to.key().as_ref(),
        ],
        bump
    )]
    pub tip: Account<'info, Tip>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Tip {
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}
