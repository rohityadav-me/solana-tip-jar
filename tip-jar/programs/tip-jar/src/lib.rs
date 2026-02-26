use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("9AkGzJbivNLB87RKowSx2PRj5nYJGDCxGdkMyVAu9vqX");

#[program]
pub mod tip_jar {
    use super::*;

    pub fn send_tip(
        ctx: Context<SendTip>,
        amount: u64,
        message: String,
    ) -> Result<()> {

        let tip_account = &mut ctx.accounts.tip_account;

        // Transfer SOL
        let transfer_instruction = system_program::Transfer {
            from: ctx.accounts.tipper.to_account_info(),
            to: ctx.accounts.recipient.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );

        system_program::transfer(cpi_ctx, amount)?;

        // Update PDA data
        tip_account.recipient = ctx.accounts.recipient.key();
        tip_account.total_tips += amount;
        tip_account.tip_count += 1;
        tip_account.last_message = message;
        tip_account.last_tipper = ctx.accounts.tipper.key();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendTip<'info> {

    #[account(mut)]
    pub tipper: Signer<'info>,

    /// CHECK: safe
    #[account(mut)]
    pub recipient: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = tipper,
        space = 8 + TipAccount::INIT_SPACE,
        seeds = [b"tip", recipient.key().as_ref()],
        bump
    )]
    pub tip_account: Account<'info, TipAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct TipAccount {

    pub recipient: Pubkey,

    pub total_tips: u64,

    pub tip_count: u64,

    #[max_len(200)]
    pub last_message: String,

    pub last_tipper: Pubkey,
}

