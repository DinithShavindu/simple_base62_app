const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const BASE = BigInt(CHARSET.length)

function bytesToBigInt(bytes) {
  let num = 0n
  for (const byte of bytes) {
    num = (num << 8n) | BigInt(byte)
  }
  return num
}

function bigIntToBytes(num) {
  if (num === 0n) return new Uint8Array([0])
  const bytes = []
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn))
    num >>= 8n
  }
  return new Uint8Array(bytes)
}

// encode converts a UTF-8 string into a Base62 string
export function encode(input) {
  const bytes = new TextEncoder().encode(input)
  let num = bytesToBigInt(bytes)

  if (num === 0n) return CHARSET[0]

  let out = ''
  while (num > 0n) {
    const rem = num % BASE
    num = num / BASE
    out = CHARSET[Number(rem)] + out
  }
  return out
}

// decode converts a Base62 string back into the original UTF-8 string
export function decode(input) {
  let num = 0n
  for (const char of input) {
    const idx = CHARSET.indexOf(char)
    if (idx < 0) {
      throw new Error(`invalid character in base62 string: "${char}"`)
    }
    num = num * BASE + BigInt(idx)
  }
  const bytes = bigIntToBytes(num)
  return new TextDecoder().decode(bytes)
}
