use solana_program::{ // to build: cargo-build-sbf 
    account_info::AccountInfo, // EVENT: SBC02-Day2
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
        msg!("{},{},{:?}" , program_id, accounts.len(), instruction_data);
        Ok(())
}
entrypoint!(process_instruction);