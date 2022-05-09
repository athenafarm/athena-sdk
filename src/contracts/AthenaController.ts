import { AccAddress, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js'
import { ContractClient } from './ContractClient'

interface InitMsg {
  governance: AccAddress
  treasury: AccAddress
}

interface UserRole {
  user: AccAddress
  is_worker: boolean
}

type UpdateConfig = InitMsg
type ConfigResponse = InitMsg
type UpdateUserRole = UserRole
type UserRoleResponse = Omit<UserRole, 'user'>

export class AthenaController extends ContractClient {
  public init(init_msg: InitMsg): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {})
  }

  /**
   * Update configuration of controller.
   * @param {UpdateConfig} config
   * @returns {MsgExecuteContract}
   */
  public updateConfig(config: UpdateConfig): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config,
    })
  }

  /**
   * Update user role.
   * @param {UpdateUserRole} config
   * @returns {MsgExecuteContract}
   */
  public updateUserRole(userRole: UpdateUserRole): MsgExecuteContract {
    return this.createExecuteMsg({
      update_role: userRole,
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

  public async userRole(user: AccAddress): Promise<UserRoleResponse> {
    return this.query({
      user_ole: {
        user,
      },
    })
  }
}
