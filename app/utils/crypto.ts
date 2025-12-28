/**
 * SM2 加密工具模块
 * 用于登录密码加密，与后端 Java BC 库兼容
 */
import Base64 from 'crypto-js/enc-base64'
import Hex from 'crypto-js/enc-hex'
import { type CipherMode, sm2 } from 'sm-crypto'

// SM2 公钥（QD值，Hex编码）
const SM2_PUBLIC_KEY = '04697b998e118ce504b523302b255eab30ae56a4ffcd4b651dcb125d799fc19b8e7bf4c80c30900911fada69046332a96ef128068a77deb2339ae4bb6115f5fcb8'

/**
 * SM2 加密
 * 后台 Java 使用 BC 库解密，必须在 JS 库加密后的 Hex 值前加上 '04'，且转为 Base64 编码格式
 * @param msg 待加密的信息
 * @param publicKey 公钥（QD值，Hex编码），如不传则使用默认公钥
 * @param cipherMode 模式：1 = C1C3C2, 0 = C1C2C3，默认 1（C1C3C2）
 * @returns 加密后的字符串（Base64 编码）
 */
export const sm2Encrypt = (
  msg: string,
  publicKey: string = SM2_PUBLIC_KEY,
  cipherMode: CipherMode = 1,
): string => Base64.stringify(Hex.parse('04' + sm2.doEncrypt(msg, publicKey, cipherMode)))

/**
 * 获取默认公钥
 * @returns 默认 SM2 公钥
 */
export function getDefaultPublicKey(): string {
  return SM2_PUBLIC_KEY
}

