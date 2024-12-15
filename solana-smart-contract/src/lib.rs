use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

// Define the data structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserData {
    pub wallet_id: Pubkey,
    pub full_name: String,
    pub address: String,
    pub phone_no: String,
}

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    if account.owner != program_id {
        msg!("Account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the instruction data
    let user_data: UserData = UserData::try_from_slice(instruction_data)?;

    // Example: Write data to account
    let mut data = account.try_borrow_mut_data()?;
    user_data.serialize(&mut *data)?;

    msg!("Data written: {:?}", user_data);

    Ok(())
}
