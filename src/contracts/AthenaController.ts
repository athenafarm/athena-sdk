import { AccAddress } from '@terra-money/terra.js'
import { ContractClient } from './ContractClient'

export interface InitMsg {
  contract_addr: AccAddress // Vault contract address.
  controller: AccAddress // Controller address.
  strategy: AccAddress // Strategy address.
  stable_denom: string // Stable coin. Default UST.
  invest_percentage: string // percentage underlying amount to be invested to strategy.
  min_lock_period: number // Minimum lock period.
  max_lock_period: number // Maximum lock period.
  sponsor_min_lock_period: number // Minimum lock period for sponsor
  claim_max_length: number // Maximum length for claims
  force_withdraw: boolean // Indicates to force withdraw from vault for emergency
}

export type UpdateConfig = Omit<InitMsg, 'contract_addr'>

export type ConfigResponse = InitMsg

export interface StateResponse {
  deposit_length: string // Total deposit length.
  total_share: string // Indicates total share.
  claim_length: string // Total claim length.
  sponsor_length: string // Total sponsor length.
  total_sponsored: string // Total sponsored amount.
}

export interface DepositResponse extends Omit<DepositMsg, 'claim_infos'> {
  principal: string // Principal amount
  current_amount: string // UST amount used to calculate yield correctly.
  share: string // Share UST amount
  maturity: number // time to be able to withdraw.
  yield_amount: string // Total yield amount generated.
  yield_claimed: string // Total yield claimed.
  principal_claimed: string // Total principal claimed.
  yield_keep_percentage: string // Yield keep percentage.
  principal_keep_percentage: string // Principal keep percentage.
  claim_length: string // Claim length
  active: boolean // Indicates if it has been withdrawn or not
}

export class AthenaController extends ContractClient {}
