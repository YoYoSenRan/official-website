/**
 * sm-crypto 类型声明
 * SM2/SM3/SM4 国密算法库
 */
declare module 'sm-crypto' {
  // SM2 加密模式
  export type CipherMode = 0 | 1

  // SM2 模块
  export const sm2: {
    /**
     * SM2 加密
     * @param msg 待加密消息
     * @param publicKey 公钥（Hex 编码）
     * @param cipherMode 加密模式：1 = C1C3C2, 0 = C1C2C3
     */
    doEncrypt: (msg: string, publicKey: string, cipherMode?: CipherMode) => string

    /**
     * SM2 解密
     * @param encryptedData 加密数据（Hex 编码）
     * @param privateKey 私钥（Hex 编码）
     * @param cipherMode 加密模式：1 = C1C3C2, 0 = C1C2C3
     */
    doDecrypt: (encryptedData: string, privateKey: string, cipherMode?: CipherMode) => string

    /**
     * 生成密钥对
     */
    generateKeyPairHex: () => { publicKey: string; privateKey: string }

    /**
     * SM2 签名
     */
    doSignature: (msg: string, privateKey: string, options?: {
      hash?: boolean
      der?: boolean
      userId?: string
    }) => string

    /**
     * SM2 验签
     */
    doVerifySignature: (msg: string, signHex: string, publicKey: string, options?: {
      hash?: boolean
      der?: boolean
      userId?: string
    }) => boolean
  }

  // SM3 哈希
  export const sm3: (msg: string) => string

  // SM4 模块
  export const sm4: {
    encrypt: (data: number[], key: number[]) => number[]
    decrypt: (data: number[], key: number[]) => number[]
  }
}
