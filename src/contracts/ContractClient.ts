import { AccAddress, Coins, Key, LCDClient, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js'
import { EmptyKey } from '../utils/EmptyKey'

export class ContractClient {
  public contractAddress?: AccAddress

  public codeID?: number

  public lcd?: LCDClient

  public key: Key

  constructor(
    options: Partial<{
      contractAddress: AccAddress
      codeID: number
      lcd: LCDClient
      key: Key
    }>,
  ) {
    this.contractAddress = options.contractAddress
    this.codeID = options.codeID
    this.lcd = options.lcd

    this.key = options.key ? options.key : new EmptyKey()
  }

  protected async query<T>(queryMmsg: any): Promise<T> {
    if (!this.contractAddress) {
      throw new Error('contractAddress not provided - unable to query')
    }

    if (!this.lcd) {
      throw new Error('LCDClient not provided')
    }

    return this.lcd.wasm.contractQuery<T>(this.contractAddress, queryMmsg)
  }

  protected createExecuteMsg(executeMsg: any, coins: Coins.Input = {}): MsgExecuteContract {
    if (!this.contractAddress) {
      throw new Error('contractAddress not provided - unable to execute message')
    }

    return new MsgExecuteContract(this.key.accAddress, this.contractAddress, executeMsg, coins)
  }

  protected createInstantiateMsg(initMsg: any, initCoins: Coins.Input = {}): MsgInstantiateContract {
    if (!this.codeID) {
      throw new Error('codeID not provided - unable to instantiate contract')
    }

    return new MsgInstantiateContract(this.key.accAddress, this.key.accAddress, this.codeID, initMsg, initCoins)
  }
}
