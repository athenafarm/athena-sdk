import { AccAddress, Dec } from '@terra-money/terra.js'

export const UST_SYMBOL = 'uusd'
export const ZERO = new Dec('0')
export const ONE = new Dec('1')
export const DEFAULT_DENOMINATOR = 1000000

export interface Token {
  token: {
    contract_addr: AccAddress
  }
}

export interface NativeToken {
  native_token: {
    denom: string
  }
}

export type AssetInfo = Token | NativeToken

export function isNativeToken(assetInfo: AssetInfo): assetInfo is NativeToken {
  return 'native_token' in assetInfo
}

export interface Asset<T extends AssetInfo> {
  info: T
  amount: string
}

export const UST: NativeToken = {
  native_token: {
    denom: UST_SYMBOL,
  },
}
