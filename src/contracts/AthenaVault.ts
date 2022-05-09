import { AccAddress, Coin, Dec, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js'
import { UST_SYMBOL } from '../utils/Asset'
import { ContractClient } from './ContractClient'

interface InitMsg {
  contract_addr: AccAddress // Vault contract address.
  controller: AccAddress // Controller address.
  strategy: AccAddress // Strategy address.
  stable_denom: string // Stable coin. Default UST.
  invest_percentage: string // percentage underlying amount to be invested to strategy.
  lock_period: number // Minimum lock period.
  force_withdraw: boolean // Indicates to force withdraw from vault for emergency
}

interface StateResponse {
  total_share: string // Indicates total share.
  total_subsidized: string // Total subsidized amount.
}

interface DepositResponse {
  principal: string // Principal amount
  current_amount: string // UST amount used to calculate yield correctly.
  share: string // Share UST amount
  maturity: number // time to be able to withdraw.
  yield_amount: string // Total yield amount generated.
  yield_claimed: string // Total yield claimed.
  principal_claimed: string // Total principal claimed.
}

type UpdateConfig = Omit<InitMsg, 'contract_addr' | 'strategy'>
type ConfigResponse = InitMsg

export class AthenaVault extends ContractClient {
  public init(init_msg: InitMsg): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {})
  }

  /**
   * Update configuration of vault.
   * @param {UpdateConfig} config
   * @returns {MsgExecuteContract}
   */
  public updateConfig(config: UpdateConfig): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config,
    })
  }

  /**
   * Deposit UST to the vault.
   * @param {Dec} amount
   * @returns {MsgExecuteContract}
   */
  public deposit(amount: Dec): MsgExecuteContract {
    return this.createExecuteMsg(
      {
        deposit: {},
      },
      [new Coin(UST_SYMBOL, amount.toString())],
    )
  }

  /**
   * Claim yield to sandclock treasury or destination address.
   * @returns {MsgExecuteContract}
   */
  public claimYield(): MsgExecuteContract {
    return this.createExecuteMsg({
      claim_yield: {},
    })
  }

  /**
   * Claim principal to sandclock treasury or destination address.
   * @returns {MsgExecuteContract}
   */
  public claimPrincipal(): MsgExecuteContract {
    return this.createExecuteMsg({
      claim_principal: {},
    })
  }

  /**
   * Withdraw UST from the vault.
   * @param {Dec} withdraw_amount
   * @param {boolean} force_withdraw
   * @returns {MsgExecuteContract}
   */
  public withdraw(withdraw_amount: Dec, force_withdraw = false): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw: {
        withdraw_amount,
        force_withdraw,
      },
    })
  }

  /**
   * Invest UST to strategy.
   * @returns {MsgExecuteContract}
   */
  public invest(): MsgExecuteContract {
    return this.createExecuteMsg({
      invest: {},
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
   * Deposit info
   * @async
   * @param {AccAddress} addr
   * @returns {DepositResponse}
   */
  public async depositInfo(addr: AccAddress): Promise<DepositResponse> {
    return this.query({
      deposit_info: {
        addr,
      },
    })
  }

  /**
   * Current UST balance in vault.
   * @async
   * @returns {Dec}
   */
  public async balance(): Promise<Dec> {
    const strValue = await this.query<string>({
      vault_balance: {},
    })

    return new Dec(strValue)
  }

  /**
   * Total UST balance in vault and strategy.
   * @async
   * @returns {Dec}
   */
  public async balanceWithInvestment(): Promise<Dec> {
    const strValue = await this.query<string>({
      total_balance: {},
    })

    return new Dec(strValue)
  }

  /**
   * Total UST balance available to invest.
   * @async
   * @returns {Dec}
   */
  public async availableToInvest(): Promise<Dec> {
    const strValue = await this.query<string>({
      available: {},
    })

    return new Dec(strValue)
  }

  /**
   * Get current state of vault contract.
   * @async
   * @returns {StateResponse}
   */
  public async stats(): Promise<StateResponse> {
    return this.query({
      state: {},
    })
  }
}
