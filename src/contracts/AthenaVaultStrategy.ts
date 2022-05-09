import { AccAddress, Dec, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js'
import { ContractClient } from './ContractClient'

interface InitMsg {
  contract_addr: AccAddress // Strategy contract address.
  controller: AccAddress // Controller address.
  vault: AccAddress // Vault address.
  performance_fee: string // Fee for execute strategies.
  stable_denom: string // Stable coin. Default UST.
  anchor_market: AccAddress // Anchor market address.
  aterra_contract_addr: AccAddress // Anchor earn contract address.
  mirror_token: AccAddress // Mirror token address.
  mirror_staking: AccAddress // Mirror staking address.
  mirror_mint: AccAddress // Mirror mint contract address.
  mirror_oracle: AccAddress // Mirror oracle address.
  terraswap_factory: AccAddress // Terraswap factory address.
}

interface StateResponse {
  anchor_deposited: string
  aterra_collateral: string
}

type UpdateConfig = Omit<InitMsg, 'contract_addr'>

type ConfigResponse = InitMsg

export class AthenaVaultStrategy extends ContractClient {
  public init(init_msg: InitMsg): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {})
  }

  /**
   * Update configuration of strategy.
   * @param {UpdateConfig} config
   * @returns {MsgExecuteContract}
   */
  public updateConfig(config: UpdateConfig): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config,
    })
  }

  /**
   * Deposit UST to anchor protocol.
   * @param {Dec} amount
   * @returns {MsgExecuteContract}
   */
  public anchorDeposit(amount: Dec): MsgExecuteContract {
    return this.createExecuteMsg({
      deposit_anchor: {
        amount: amount.toString(),
      },
    })
  }

  /**
   * Withdraw UST from anchor protocol.
   * @param {Dec} amount aUST amount to withdraw
   * @returns {MsgExecuteContract}
   */
  public anchorWithdraw(amount: Dec): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw_anchor: {
        aterra_amount: amount.toString(),
      },
    })
  }

  /**
   * Deposit UST to Mirror protocol.
   * @param {AccAddress} mirror_asset_addr
   * @param {Dec} amount
   * @returns {MsgExecuteContract}
   */
  public mirrorDeposit(mirror_asset_addr: AccAddress, amount: Dec): MsgExecuteContract {
    return this.createExecuteMsg({
      deposit_mirror: {
        amount: amount.toString(),
        mirror_asset_addr,
      },
    })
  }

  /**
   * Withdraw UST from mirror staking pool.
   * @param {AccAddress} mirror_asset_addr
   * @param {Dec} amount
   * @returns {MsgExecuteContract}
   */
  public mirrorWithdraw(mirror_asset_addr: AccAddress, amount: Dec): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw_mirror: {
        mirror_lp_amount: amount.toString(),
        mirror_asset_addr,
      },
    })
  }

  /**
   * Claim MIR reward and swap to UST.
   * @returns {MsgExecuteContract}
   */
  public claim(): MsgExecuteContract {
    return this.createExecuteMsg({
      compound_mirror: {},
    })
  }

  /**
   * Open short position to mirror mint contract using aUST and borrow specific mirror token
   * @param {AccAddress} mirror_asset_addr
   * @param {Dec} amount
   * @param {Dec} collateral_ratio
   * @param {Dec} belief_price
   * @param {Dec} max_spread
   * @returns {MsgExecuteContract}
   */
  public openShortPosition(
    mirror_asset_addr: AccAddress,
    amount: Dec,
    collateral_ratio: Dec,
    belief_price?: Dec,
    max_spread?: Dec,
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      open_short_position: {
        mirror_asset_addr,
        aterra_amount: amount.toString(),
        collateral_ratio: collateral_ratio.toString(),
        belief_price: belief_price?.toString() ?? null,
        max_spread: max_spread?.toString() ?? null,
      },
    })
  }

  /**
   * Buy mirror token and repay and close position.
   * @param {string} position_idx position idx registered in mirror mint contrac
   * @returns {MsgExecuteContract}
   */
  public closeShortPosition(position_idx: string): MsgExecuteContract {
    return this.createExecuteMsg({
      close_short_position: {
        position_idx,
      },
    })
  }

  /**
   * Withdraw all UST from anchor and mirror.
   * @returns {MsgExecuteContract}
   */
  public withdrawAll(): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw_all: {},
    })
  }

  /**
   * Withdraw UST from strategy to vault.
   * @returns {MsgExecuteContract}
   */
  public withdrawToVault(amount?: Dec): MsgExecuteContract {
    let params = {}

    if (amount) {
      params = { amount: amount.toString() }
    }

    return this.createExecuteMsg({
      withdraw_to_vault: params,
    })
  }

  /**
   * Withdraw specific amount of invested UST.
   * @returns {MsgExecuteContract}
   */
  public withdrawInvested(amount: Dec): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw_to_vault: {
        amount: amount.toString(),
      },
    })
  }

  /**
   * Get configuration of vault.
   * @async
   * @returns {ConfigResponse}
   */
  public async config(): Promise<ConfigResponse> {
    return this.query({
      config: {},
    })
  }

  /**
   * Calculate all UST balance in strategy(anchor + mirror + UST balance of strategy contract).
   * @async
   * @returns {Dec}
   */
  public async totalBalance(): Promise<Dec> {
    const strValue = await this.query<string>({
      total_balance: {},
    })

    return new Dec(strValue)
  }

  /**
   * Get current state of strategy contract.
   * @async
   * @returns {StateResponse}
   */
  public async stats(): Promise<StateResponse> {
    return this.query({
      state: {},
    })
  }
}
